//
//  TxHistoryViewController.swift
//  MozoSDK
//
//  Created by HoangNguyen on 10/2/18.
//

import Foundation
import UIKit

class TxHistoryViewController: MozoBasicViewController {
    var eventHandler: TxHistoryModuleInterface?
    // MARK: - Properties
    @IBOutlet var tableView: UITableView!
    @IBOutlet weak var btnSelect: UIButton!
    @IBOutlet weak var floatingView: UIView!
    @IBOutlet weak var btnFloatingAll: UIButton!
    @IBOutlet weak var btnFloatingReceived: UIButton!
    @IBOutlet weak var btnFloatingSent: UIButton!
    
    private let refreshControl = UIRefreshControl()
    private var isLoadingMoreTH = false
    private var isFiltering = false
    
    var collection : TxHistoryDisplayCollection?
    var filteredItems = [TxHistoryDisplayItem]()
    var currentPage : Int = 1
    
    // MARK: - View Setup
    override func viewDidLoad() {
        super.viewDidLoad()
        definesPresentationContext = true
        
        // Add Refresh Control to Table View
        if #available(iOS 10.0, *) {
            self.tableView?.refreshControl = refreshControl
        } else {
            self.tableView?.addSubview(refreshControl)
        }
        self.refreshControl.addTarget(self, action: #selector(self.refresh(_:)), for: .valueChanged)
        tableView.tableFooterView = UIView()
        
        setLayerBorder()
        eventHandler?.updateDisplayData(page: currentPage)
    }
    
    @objc func refresh(_ sender: Any? = nil) {
        eventHandler?.updateDisplayData(page: 1)
        if let refreshControl = sender as? UIRefreshControl, refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
    
    func setLayerBorder() {
        btnSelect.layer.borderWidth = 1
        btnSelect.layer.cornerRadius = 0.15 * btnSelect.bounds.size.width
        btnSelect.layer.borderColor = ThemeManager.shared.borderInside.cgColor
        
//        btnFloatingAll.layer.borderWidth = 1
        btnFloatingAll.layer.cornerRadius = 0.15 * btnFloatingAll.bounds.size.width
//        btnFloatingAll.layer.borderColor = ThemeManager.shared.borderInside.cgColor
        
        floatingView.layer.borderWidth = 1
        floatingView.layer.borderColor = ThemeManager.shared.disable.cgColor
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.title = "TRANSACTION HISTORY"
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    // MARK: - Private instance methods
    
    func filterContentForType(_ type: TransactionType?) {
        if collection == nil || collection?.displayItems.count == 0 {
            return
        }
        isFiltering = false
        if type != nil {
            isFiltering = true
            filteredItems = (collection?.filterByTransactionType(type!))!
        }
        tableView.reloadData()
    }
    
    @IBAction func touchedBtnSelect(_ sender: Any) {
        presentFloatingView()
    }
    
    func presentFloatingView() {
        floatingView.isHidden = false
    }
    
    func dismissFloatingView() {
        floatingView.isHidden = true
    }
    
    // MARK: Floating view actions
    @IBAction func touchedBtnFloatingAll(_ sender: Any) {
        dismissFloatingView()
        filterContentForType(nil)
    }
    
    @IBAction func touchedBtnFloatingReceived(_ sender: Any) {
        dismissFloatingView()
        filterContentForType(TransactionType.Received)
    }
    
    @IBAction func toucheBtnFloatingSent(_ sender: Any) {
        dismissFloatingView()
        filterContentForType(TransactionType.Sent)
    }
}
// MARK: - Table View
extension TxHistoryViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return collection != nil ? 1 : 0
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if isFiltering {
            return filteredItems.count
        }

        return collection?.displayItems.count ?? 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "TxHistoryTableViewCell", for: indexPath) as! TxHistoryTableViewCell
        let item: TxHistoryDisplayItem
        if isFiltering {
            item = filteredItems[indexPath.row]
        } else {
            item = (collection?.displayItems[indexPath.row])!
        }
        cell.txHistory = item
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 61
    }
}

extension TxHistoryViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if let selectedItem = collection?.displayItems[indexPath.row] {
            eventHandler?.selectTxHistoryOnUI(selectedItem)
        }
    }
}

extension TxHistoryViewController : TxHistoryViewInterface {
    func showTxHistoryDisplayData(_ data: TxHistoryDisplayCollection, forPage: Int) {
        if forPage > currentPage {
            if data.displayItems.count > 1 {
                // Append to current collection
                collection?.appendCollection(data)
                currentPage = forPage
                isLoadingMoreTH = false
            }
        } else {
            currentPage = 1
            isFiltering = false
            collection = data
        }
        tableView.reloadData()
    }
    
    func showNoContentMessage() {
        
    }
}

extension TxHistoryViewController: UIScrollViewDelegate {
    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        //Bottom Refresh
        if scrollView == tableView {
            if ((scrollView.contentOffset.y + scrollView.frame.size.height) >= scrollView.contentSize.height) {
                if !isLoadingMoreTH && collection != nil && (collection?.displayItems.count)! > 0 {
                    let nextPage = currentPage + 1
                    print("Load more transaction histories with next page: \(nextPage)")
                    isLoadingMoreTH = true
                    eventHandler?.updateDisplayData(page: nextPage)
                }
            }
        }
    }
}

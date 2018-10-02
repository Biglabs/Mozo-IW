//
//  AddressBookViewController.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
import UIKit

class AddressBookViewController: MozoBasicViewController {
    var eventHandler: AddressBookModuleInterface?
    // MARK: - Properties
    @IBOutlet var tableView: UITableView!
    @IBOutlet var searchFooter: MozoSearchFooter!
    
    var displayData : AddressBookDisplayData?
    var addrBooks = [AddressBookDisplayItem]()
    var filteredAbs = [AddressBookDisplayItem]()
    let sectionTitles = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    let searchController = UISearchController(searchResultsController: nil)
    
    // MARK: - View Setup
    override func viewDidLoad() {
        super.viewDidLoad()
        // Setup the Search Controller
        searchController.searchResultsUpdater = self
        searchController.obscuresBackgroundDuringPresentation = false
        searchController.searchBar.placeholder = "Search"
        
        if #available(iOS 11.0, *) {
            navigationItem.searchController = searchController
        } else {
            tableView.tableHeaderView = searchController.searchBar
        }
        // Setup the Scope Bar
        searchController.searchBar.scopeButtonTitles = sectionTitles
        searchController.searchBar.delegate = self
        
        definesPresentationContext = true
        
        // Setup the search footer
        tableView.tableFooterView = searchFooter
        enableBackBarButton()
        eventHandler?.updateDisplayData()
    }
    
    override func viewWillAppear(_ animated: Bool) {
//        if splitViewController!.isCollapsed {
//            if let selectionIndexPath = tableView.indexPathForSelectedRow {
//                tableView.deselectRow(at: selectionIndexPath, animated: animated)
//            }
//        }
        super.viewWillAppear(animated)
        self.title = "ADDRESS BOOK"
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    // MARK: - Private instance methods
    
    func filterContentForSearchText(_ searchText: String, scope: String = "A") {
        if addrBooks.count == 0 {
            return
        }
        filteredAbs = addrBooks.filter({( item : AddressBookDisplayItem) -> Bool in
            if searchBarIsEmpty() {
                return true
            }
            return item.name.lowercased().contains(searchText.lowercased())
        })
        tableView.reloadData()
    }
    
    func searchBarIsEmpty() -> Bool {
        return searchController.searchBar.text?.isEmpty ?? true
    }
    
    func isFiltering() -> Bool {
        let searchBarScopeIsFiltering = searchController.searchBar.selectedScopeButtonIndex != 0
        return searchController.isActive && (!searchBarIsEmpty() || searchBarScopeIsFiltering)
    }
}
// MARK: - Table View
extension AddressBookViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return displayData?.sections.count ?? 0
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if isFiltering() {
            searchFooter.setIsFilteringToShow(filteredItemCount: filteredAbs.count, of: addrBooks.count)
            return filteredAbs.count
        }
        
        searchFooter.setNotFiltering()
        return addrBooks.count
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        if displayData == nil {
            return ""
        }
        let name = displayData?.sections[section].sectionName
        return name
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MozoAddressBookCell", for: indexPath)
        cell.textLabel!.text = ""
        cell.detailTextLabel!.text = ""
        if (displayData?.sections[indexPath.section].items.count)! > 0 {
            let item: AddressBookDisplayItem
            if isFiltering() {
                item = filteredAbs[indexPath.row]
            } else {
                item = addrBooks[indexPath.row]
            }
            cell.textLabel!.text = item.name
            cell.detailTextLabel!.text = item.address
        }
        return cell
    }
}

extension AddressBookViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let selectedItem = displayData?.sections[indexPath.section].items[indexPath.row] {
            eventHandler?.selectAddressBookOnUI(selectedItem)
        }
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = UIView()
        
        let headerLabel = UILabel(frame: CGRect(x: 15, y: 10, width:
            tableView.bounds.size.width, height: tableView.bounds.size.height))
        headerLabel.textColor = ThemeManager.shared.main
        headerLabel.font = UIFont.boldSystemFont(ofSize: 20)
        headerLabel.text = self.tableView(self.tableView, titleForHeaderInSection: section)
        headerLabel.sizeToFit()
        headerView.addSubview(headerLabel)
        
        return headerView
    }
    
    func sectionIndexTitles(for tableView: UITableView) -> [String]? {
        return sectionTitles
    }
}

extension AddressBookViewController: UISearchBarDelegate {
    // MARK: - UISearchBar Delegate
    func searchBar(_ searchBar: UISearchBar, selectedScopeButtonIndexDidChange selectedScope: Int) {
        filterContentForSearchText(searchBar.text!, scope: searchBar.scopeButtonTitles![selectedScope])
    }
}

extension AddressBookViewController: UISearchResultsUpdating {
    // MARK: - UISearchResultsUpdating Delegate
    func updateSearchResults(for searchController: UISearchController) {
        let searchBar = searchController.searchBar
        let scope = searchBar.scopeButtonTitles![searchBar.selectedScopeButtonIndex]
        filterContentForSearchText(searchController.searchBar.text!, scope: scope)
    }
}

extension AddressBookViewController : AddressBookViewInterface {
    func showAddressBookDisplayData(_ data: AddressBookDisplayData, allItems: [AddressBookDisplayItem]) {
        displayData = data
        addrBooks = allItems
        tableView.reloadData()
    }
    
    func showNoContentMessage() {
        
    }
}

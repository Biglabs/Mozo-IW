//
//  iBeaconService.swift
//  SoloSDK
//
//  Created by Hoang Nguyen on 8/14/18.
//


// Add the ESTBeaconManagerDelegate protocol
public final class iBeaconService: NSObject, ESTBeaconManagerDelegate {
    fileprivate let beaconManager = ESTBeaconManager()
    
    override init() {
        super.init()
        
        beaconManager.delegate = self
        beaconManager.requestAlwaysAuthorization()
        
        let beaconRegion = CLBeaconRegion(
            proximityUUID: UUID(uuidString: "B9407F30-F5F8-466E-AFF9-25556B57FE6D")!,
            identifier: "EstimoteRegion")
        self.beaconManager.startRangingBeacons(in: beaconRegion)
        
        for region in beaconManager.monitoredRegions {
            beaconManager.stopMonitoring(for: region as! CLBeaconRegion)
        }
    }
    
    public func beaconManager(_ manager: Any, didRangeBeacons beacons: [CLBeacon],
                              in region: CLBeaconRegion) {
        //        print("Found [\(beacons.count)] beacons")
        //        for beacon in beacons {
        //            print("Beacon [\(beacon.debugDescription)]")
        //        }
    }
}


package com.biglabs.solo.blockcypher.service;

import com.biglabs.solo.blockcypher.model.BCYAddress;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestOperations;

/**
 * Created by antt on 6/27/2018.
 */
@Service
public class BCYAddressService {
    private RestOperations restOperations;
    private String endpoint = "https://api.blockcypher.com/v1/btc/test3/addrs";
    public BCYAddressService(RestOperations restOperations) {
        this.restOperations = restOperations;
    }

    public BCYAddress balance(String address) {
        String url = endpoint + "/" + address + "/balance";
        System.out.println("Get balance " + url);
        BCYAddress ret = restOperations.getForObject(url, BCYAddress.class);
        return  ret;
    }

}

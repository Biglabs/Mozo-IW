package com.biglabs.solo.service.util;

import org.apache.commons.lang3.RandomStringUtils;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Utility class for generating random Strings.
 */
public final class RoundrobinApiTokens {
    private final String serviceName;
    private final List<String> tokens;
    private AtomicInteger count;


    public RoundrobinApiTokens(List<String> tokens, String serviceName) {
        this.tokens = new ArrayList<>(tokens);
        this.serviceName = serviceName;
        count = new AtomicInteger(0);
    }

    public synchronized String getToken() {
        if (tokens.size() == 0) {
            return "";
        }

        int index = count.getAndIncrement();
        return tokens.get(index % tokens.size());
    }

    @Override
    public String toString() {
        return "RoundrobinApiTokens{" +
            "serviceName='" + serviceName + '\'' +
            ", tokens=" + tokens +
            ", count=" + count +
            '}';
    }
}

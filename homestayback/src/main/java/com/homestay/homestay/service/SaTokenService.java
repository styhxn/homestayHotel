package com.homestay.homestay.service;

import java.util.List;

/**
 * @author:  张喜龙
 * @date:  2022/11/1 18:01
 * @version: 1.0
 * @Description: 
 */
public interface SaTokenService {
    /**
     *
     * @param userId
     * @return 权限列表集合
     */
    List<String> getPermissionStr(Long userId);

    /**
     *
     * @param userId
     * @return 权限角色
     */
    List<String> getRoleList(Long userId);


}

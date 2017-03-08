# chatMap

Use react-native with firebase create an app.

This project can :

* Log In/Out
* Show user loaction with google map.(trun on the GPS)
* When click user marker show what user said last time.
* Click other user's callout message can open the chat room and chat whit him/her.
* show User chat member list

此APP利用React Native + Google Map API + Firebase 實現具有地圖功能之社群軟體

根據已註冊之使用者目前位置標記其座標並發表動態，且可經由Google Map滑動操作查看附近其他使用者動態，點擊其他特定使用者將開啟個人聊天室可進行即時聊天

#Feature

* online/offline display
* User location and message record list
* User image upload

#Demo



#Tools
1. react-native
2. dva Framework (React and redux based, lightweight and elm-style framework) (react-native @0.38.0)
3. antd-mobile GUI Framework
4. react-native-router-flux
5. Google firebase
6. lodash
7. react-native-maps(android)

#Usage

> git clone https://github.com/mong991/chatMap.git
> cd chatMap
> npm install

> react-native run-android 

> react-native run-ios

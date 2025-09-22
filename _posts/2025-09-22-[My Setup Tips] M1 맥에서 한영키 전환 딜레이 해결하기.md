---
layout: post
title: "[macOS] M1 맥에서 한영키 전환 딜레이 해결하기"
categories: [macOS, My Setup Tips]
tags: [macos, m1, capslock, 한영, 키보드, hidutil, plist]
---

# 💻 M1 맥에서 한영키 전환 딜레이 해결하기

📌 원본: [bennlee Gist](https://gist.github.com/bennlee/036e58d9f7a8e2f351e2a7cf6a92959b)

이 문서는 M1 맥에서 Caps Lock(한영키) 전환 딜레이 문제를 해결하는 방법을 정리한 내용입니다. 
서드파티 앱 없이 macOS 공식 방법으로 문제를 해결하는 과정을 블로그 형식으로 기록했습니다.

---

## 문제 상황
- M1 맥에서 Caps Lock 키를 한영 전환키로 사용 시 딜레이 발생
- 기존 Karabiner-Elements 방법이 Apple Silicon에서 정상 동작하지 않음

## 해결 방법

### 1. hidutil을 사용한 키 재매핑
macOS의 `hidutil`을 이용해 Caps Lock 키를 다른 키로 매핑하고, 로그인 시 자동 적용하도록 LaunchAgent plist를 생성합니다.

```bash
tee ~/Library/LaunchAgents/com.example.KeyRemapping.plist << END
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.example.KeyRemapping</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/hidutil</string>
        <string>property</string>
        <string>--set</string>
        <string>{"UserKeyMapping":[
          {
            "HIDKeyboardModifierMappingSrc": 0x700000039,
            "HIDKeyboardModifierMappingDst": 0x70000006D
          }
        ]}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
END
```

- 재부팅 없이 적용하려면:
```bash
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x70000006D}]}'
```

### 2. macOS 입력 메뉴 단축키 설정
- [시스템 환경설정] → [키보드] → [단축키 탭] → [입력소스]
- “입력 메뉴에서 다음 소스 선택”을 방금 재매핑한 키(F18 등)로 설정
- 이제 Caps Lock 키를 눌러도 딜레이 없이 한영 전환 가능

---

## 결론
- Karabiner-Elements 없이도 M1 맥에서 한영 전환 딜레이 문제 해결 가능
- plist + hidutil 조합으로 로그인 시 자동 적용
- 블로그 글이나 개인 기록용으로 정리하면 재참조 가능

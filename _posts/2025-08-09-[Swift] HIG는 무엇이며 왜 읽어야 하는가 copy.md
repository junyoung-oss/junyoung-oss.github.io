---
layout: post
title: "[macOS] 새 맥북 개발 환경 세팅 기록"
categories: [macOS, Setup]
tags: [macbook, setup, homebrew, git, vscode]
---

# 🖥️ 처음 맥북 세팅하기 (개인 기록)

> 새로 구입한 맥북을 개발용으로 세팅할 때 참고하는 개인용 가이드입니다.

---

## 목차
- [맥북 초기화](#맥북-초기화)
- [Touch ID 및 암호](#touch-id-및-암호)
- [키보드](#키보드)
- [트랙패드](#트랙패드)
- [Dock & 제어센터](#dock--제어센터)
- [터미널 & Homebrew](#터미널--homebrew)
- [Git & GitHub 설정](#git--github-설정)
- [SSH 키 생성](#ssh-키-생성)
- [자주 설치하는 앱](#자주-설치하는-앱)
- [dotfiles 관리](#dotfiles-관리)
- [스크린샷 설정](#스크린샷-설정)
- [유용한 단축키 & 팁](#유용한-단축키--팁)
- [백업 체크리스트](#백업-체크리스트)

---

## 맥북 초기화
맥북을 새로 세팅하면서 문제가 발생하면 초기화하여 새것처럼 시작할 수 있습니다.  
iCloud, Dropbox 등의 클라우드 서비스를 사용하거나 중요 데이터만 백업하면 간단하게 진행할 수 있습니다.

```text
시스템 설정 > 일반 > 전송 또는 재설정 > 모든 콘텐츠 및 설정 지우기
```

<!-- 스크린샷: 초기화 화면 -->

---

## Touch ID 및 암호
오른손 검지 또는 중지 손가락을 등록하는 것이 일반적이며, 필요 시 왼손 손가락도 추가 등록 가능.  
세팅 후 많은 인증이 필요하므로 미리 등록해두는 것이 편리합니다.

<!-- 스크린샷: Touch ID 등록 화면 -->

---

## 키보드
- 키 반복 속도: `빠르게`
- 반복 지연 시간: `짧게`
- 키보드 단축키 세팅 가능
  - 입력 소스 설정
  - Karabiner-Elements 사용 시 세부 설정 가능

<!-- 스크린샷: 키보드 설정 -->

---

## 트랙패드
- 탭하여 클릭: `On`
- 드래그 스타일: 세 손가락 드래그
- 손쉬운 사용 옵션 필요시 설정

<!-- 스크린샷: 트랙패드 설정 -->

---

## Dock & 제어센터
- Dock 자동 숨김: `On`
- 제어센터 / 메뉴바: 시계 초 표시 `On`
- 화면 보호기: 매일 배경화면 셔플

<!-- 스크린샷: Dock & 제어센터 -->

---

## 터미널 & Homebrew
Homebrew 설치:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치 확인:
```bash
brew -v
```

패키지 설치:
```bash
brew install git node python
brew install --cask visual-studio-code iterm2 google-chrome
```

---

## Git & GitHub 설정
Git 설치:
```bash
brew install git
```

기본 Git 설정:
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global credential.helper osxkeychain
git config --global core.autocrlf input
git config --global pull.rebase true
```

GitHub 계정 연결 및 확인:
```bash
ssh -T git@github.com
```

---

## SSH 키 생성
SSH 키 생성 (ed25519 권장):
```bash
ssh-keygen -t ed25519 -C "you@example.com"
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub
```
GitHub Settings > SSH Keys에 등록

<!-- 스크린샷: SSH 키 생성 화면 -->

---

## 자주 설치하는 앱
```bash
brew install --cask   iterm2   visual-studio-code   google-chrome   firefox   docker   notion   slack   rectangle   alfred   figma
```

---

## dotfiles 관리
```bash
git clone git@github.com:yourname/dotfiles.git ~/dotfiles
cd ~/dotfiles
./install.sh
```

---

## 스크린샷 설정
PNG → JPG로 변경:
```bash
defaults write com.apple.screencapture type jpg
killall SystemUIServer
```

복원:
```bash
defaults write com.apple.screencapture type png
killall SystemUIServer
```

---

## 유용한 단축키 & 팁
- 스크린샷: `Cmd + Shift + 3` / `Cmd + Shift + 4`
- 클립보드: `pbcopy` / `pbpaste`
- 암호 관리: Keychain 또는 1Password

---

## 백업 체크리스트
- iCloud / 외장 디스크 동기화
- 사진·동영상 이중 백업
- 브라우저 북마크 / 비밀번호 저장
- SSH 키 보관
- brew list / brew list --cask 기록

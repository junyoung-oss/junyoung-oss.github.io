---
layout: post
title: "[Swift] SwiftUI의 View Layout 결정 원리"
categories: [SwiftUI]
tags: [swift, swiftui, ios]
---

UIKit에는 Auto Layout이 있지만,  
SwiftUI는 Auto Layout을 직접적으로 쓰지 않고  
**자체 레이아웃 시스템**을 가지고 있음.  

이건 SwiftUI가 **선언형 패러다임**에 맞게 설계되었기 때문.  

---

## Modifier 적용 흐름 📄

```swift
struct ContentView: View {
 var body: some View {
   Text("Hello world!")
	•padding(20)
	.background(Color.red)
 }
}
```
위에서 작성한 코드를 보면
- 텍스트가 먼저 자기 크기를 결정 (폰트, 글자 수 등)  
- 패딩은 텍스트 주변에 여백을 추가  
- 배경은 크기를 바꾸지 않고, 패딩까지 포함한 영역에 색상을 입힘  
- Content View는 내부 뷰의 크기를 그대로 따라감  
- Root View는 다시 Content View의 크기를 반영  

👉 **부모 뷰 크기가 강제로 지정되지 않으면 → 자식 뷰 크기에 의해 부모 뷰 크기까지 결정됨**

---

## 레이아웃 흐름 정리 🔄

1. **Root View**  
   - 기본적으로 화면 전체를 쓸 수 있음 (세이프 에어리어 제외)  
   - 하위 뷰에 레이아웃 공간을 제공  

2. **Content View**  
   - **레이아웃 중립 상태**  
   - 자기 크기를 직접 정하지 않고, **Body의 크기를 그대로 따름**  

3. **Background / Padding**  
   - Background → 크기를 변경하지 않고 그대로 전달  
   - Padding → 내부 뷰 크기에 여백을 더해서 새로운 크기 제공  

4. **Text**  
   - 글자 크기만큼만 공간을 차지  
   - 별도 프레임이 없으면 최소 크기만 가짐  
   - 위치 지정이 없으면 기본적으로 **센터 배치**  

5. **흐름 반환**  
   - Text → Padding → Background → Content View → Root View  
   - 각 단계에서 크기와 위치가 조정됨  

---

## 결론 ✅

SwiftUI의 핵심은 **"부모가 크기를 정하지 않으면, 자식 뷰가 자기 크기를 결정하고 그게 다시 부모에게 반영된다"** 는 점.  

이 원리를 알면 UI를 구성하고 배치하는 과정이 한결 단순해짐 🚀
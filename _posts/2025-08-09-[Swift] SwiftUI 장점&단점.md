---
layout: post
title: "SwiftUI 장점/단점"
date: 2025-08-09 23:49:00 +0900
categories: [Swift, SwiftUI]
tags: [swift, swiftui, ios]
---

## ✅ 장점

- **선언형**으로 코드를 짤 수 있음  
  → "어떻게"보다 "무엇을" 표현하는 방식. UIKit보다 훨씬 깔끔.  
- **Modifier** 붙이는 방식이 직관적  
  ```swift
  Text("Hello")
    .font(.title)
    .foregroundColor(.blue)
  ```
  필요한 것만 붙이면 되니까 코드가 가볍다.
- **Preview** 기능  
  빌드 돌릴 필요 없이 바로 확인 가능 → 시간 절약 👍  

## ⚠️ 단점

- 아직 **UIKit 완전 대체 불가**  
  - ScrollView나 복잡한 뷰는 UIKit 써야 하는 경우 있음  
- **버전 바뀔 때 문법 변동**  
  → 레퍼런스 계속 확인해야 함  
- 컴포넌트 제약이 많아서, 생각보다 커스터마이징에 한계가 있음  

---

> 💡 결론: SwiftUI 혼자 쓰기엔 아쉽고, UIKit 병행이 필수.  
> 그래도 구조가 깔끔해서 배우는 재미는 확실히 있음.
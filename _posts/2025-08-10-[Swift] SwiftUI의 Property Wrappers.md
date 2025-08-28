---
layout: post
title: "[Swift] SwiftUI의 Property Wrappers"
categories: [SwiftUI]
tags: [swift, swiftui, ios, propertywrapper]
---

SwiftUI를 제대로 쓰려면 **Property Wrappers** 개념을 확실히 이해해야 함.  
SwiftUI에서 상태 관리와 데이터 흐름을 다루는 핵심 도구들이라, 뷰를 만들다 보면 필수적으로 맞닥뜨리게 된다.  

Property Wrapper는 Swift 언어 차원에서 **속성(프로퍼티)에 기능을 덧붙일 수 있는 사용자 정의 속성 모디파이어**라고 볼 수 있다.  
SwiftUI에서는 이를 활용해 **상태 관리, 데이터 공유, 뷰 업데이트** 같은 로직을 깔끔하게 처리한다.  

---

## 주요 Property Wrappers 및 관련 개념 목록
- **@State**  
- **@Binding**  
- **ObservableObject (프로토콜)**  
- **@Published**  
- **@ObservedObject**  
- **@StateObject**  
- **@Environment**  
- **@EnvironmentObject**  

ObservableObject는 프로퍼티 래퍼가 아니라 프로토콜이지만,  
다른 래퍼들과 함께 자주 쓰이므로 같이 정리한다.

---

## @State 🔑
- 뷰의 **상태(state)를 저장**하는 프로퍼티.  
- 상태의 소유권은 해당 뷰에 있으며, 값이 변하면 뷰가 다시 그려진다.  
- 기본적으로 `private` 접근 제한자를 가진다.  
- 다른 뷰와 값을 공유하려면 **@Binding**을 사용해야 한다.  

```swift
struct ContentView.View {
 @State private var isPlaying: Bool = false
 
 var body: some View {
   Button(isPlaying ? "Pause" : "Play") {
   	 isPlaying.toggle()
   }
  }
 }
```
위 코드는 버튼을 누를 때마다 상태값이 변하고, 그 값에 따라 버튼의 레이블이 실시간으로 바뀌는 구조.  
- `isPlaying`은 `@State`로 선언된 `Bool` 타입 프로퍼티이며 초기값은 `false`  
- 버튼은 `isPlaying` 값이 `true`면 `"Pause"`, `false`면 `"Play"`라는 텍스트를 표시  
- `@State` 프로퍼티는 뷰의 상태를 저장하고, 값이 변경되면 UI에 자동으로 반영됨  
- 버튼 액션에서는 `isPlaying.toggle()`을 호출해 값이 `true ↔ false`로 전환  
- 사용자가 버튼을 누를 때마다 상태값이 바뀌고, 그에 맞춰 버튼 텍스트도 변경됨  

👉 결국, SwiftUI에서 UI 업데이트는 `@State` 프로퍼티의 변경을 통해 자동으로 이루어진다.

---

## @Binding 🔗
- **상위 뷰의 상태(@State)** 를 **하위 뷰와 공유**할 때 사용.  
- 자체적으로 값을 저장하지 않고, 다른 뷰의 상태와 연결만 한다.  
- 상위/하위 뷰 사이에서 값을 **양방향으로 동기화**할 수 있다.  
- `$` 기호를 이용해 @State 변수를 @Binding으로 전달한다.  

**\[1번 상위뷰 코드\]**
```swift
struct PlayerView: View {
 var episode: Episode
 @State private var isPlaying: Bool = false
 
 var body: some View {
  VStack {
   Text(episode.title)
    .foregroundStyle(isPlaying ?.primary : .secondary)
   PlayButton(isPlaying: $isPlaying) // Binding
   }
  }
 }
```

---

**\[2번 하위뷰 코드\]**

```swift
struct PlayButton: View {
 @Binding var isPlaying: Bool
 
 var body: some View t
  Button(isPlaying ? "pause" : "Play") {
  	isPlaying.toggle()
    }
   }
```

- `PlayerView`라는 **상위 뷰**가 있고, 그 안에 **플레이 버튼 뷰(하위 뷰)**가 포함되어 있음  
- 상위 뷰에는 `@State` 프로퍼티인 `isPlaying`이 선언되어 있음  
  - 이 값은 에피소드 타이틀의 스타일에도 사용되고, 하위 뷰에서도 공유되어야 함  
- 하위 뷰에서는 `@Binding`을 통해 상위 뷰의 `isPlaying`을 전달받음  
  - 하위 뷰에서 값을 변경하면 상위 뷰에도 동일하게 반영  
  - 반대로 상위 뷰에서 값이 바뀌면 하위 뷰도 같이 업데이트  

👉 즉, `@Binding`은 **상위 뷰의 상태를 하위 뷰와 공유하고 양방향으로 연결**할 수 있도록 해줌.  
👉 `$` 기호는 `@State` 변수의 **참조를 생성**하는 역할을 함.  

📌 정리하면, `@State`와 `@Binding`의 관계를 이해하면 **SwiftUI의 절반은 이해한 것**이라고 해도 과언이 아님.

---

## ObservableObject 👀
- 클래스에서 채택하는 **프로토콜**.  
- 특정 값이 변하면 이를 외부(주로 뷰)에서 감지할 수 있도록 한다.  
- 보통 **뷰모델(ViewModel)** 역할을 하는 클래스에서 채택한다.  
- 이 안에서 @Published 프로퍼티를 선언하면 값 변경 시 자동으로 알림을 발행한다.  

```swift
class Contact: ObservableObject {
 @Published var name: String
 @Published var age: Int
 
 init(name: String, age: Int) {
  self.name = name
  self.age = age
}

 func haveBirthday() -> Int {
  age += 1 
  return age
 }
}
```

```swift
let john = Contact(name: "John Appleseed", age: 24)
 cancellable = john.objectWillChange
  .sink { _ in
   print("\(john.age) will change")
 }
print(john.haveBirthday())
```
- `ObservableObject` 프로토콜을 채택한 클래스는 **값이 바뀔 때마다 변화를 외부에 알릴 수 있음**  
- 주로 **뷰모델(ViewModel)**에서 사용됨  

- 클래스 안의 프로퍼티가 `@Published`로 선언되어 있으면  
  → 값이 변경될 때마다 자동으로 변경 알림을 발행  
  → 해당 값을 감시하는 뷰(UI)는 알아서 업데이트  

- 예시에서 `haveBirthday()` 함수는 나이를 한 살 늘려주는 역할  
  → `age`가 `@Published`이기 때문에 값이 바뀌면 즉시 알림이 전달됨  

- 외부 코드에서 `objectWillChange`를 통해 객체 변화를 감시할 수 있음  
  → 값이 바뀌기 **직전에** 알림이 발행되고, 그 후 값이 실제로 변경됨  

👉 정리하면,  
`@Published`는 **프로퍼티 변화 감지 & 알림 발행**을 담당하고,  
`ObservableObject`는 이 알림을 **뷰와 연결**시켜 UI가 자동으로 갱신되게 해줌.

---

## @Published 📢
- **ObservableObject 내부**에서 사용하는 프로퍼티 래퍼.  
- 값이 변경되면 자동으로 **objectWillChange.send()**를 호출해 뷰에 알린다.  
- 따라서 뷰는 해당 값이 바뀔 때마다 자동으로 업데이트된다.  

---

## @ObservedObject 👓
- 뷰에서 **외부에서 주입받은 ObservableObject 인스턴스**를 관찰할 때 사용.  
- 객체의 값이 변경되면 뷰가 자동으로 업데이트된다.  
- 하지만 뷰가 새로 생성될 때마다 인스턴스도 새로 생성되는 문제가 있다 → 이럴 땐 **@StateObject**를 사용.  

```swift
class User: ObservableObject {
 @Published var age = 10
}
```

```swift
struct ContentView: View {
 @ObservedObject var user: User

 var body: some View {
  Button("Plus Age") 
   user.age += 1
   }
  }
```
- `@ObservedObject`는 **뷰에서 ObservableObject 타입의 인스턴스를 감시**할 때 사용  
- 해당 객체 안의 `@Published` 프로퍼티가 변경되면 **뷰가 자동으로 다시 렌더링**됨  

- 특징  
  - 뷰가 객체를 직접 생성하지 않고 **외부에서 전달받은 인스턴스**를 감시  
  - 값이 변하면 즉시 UI에 반영되어, 상태와 뷰가 항상 동기화됨  

👉 정리하면,  
`@ObservedObject`는 **외부에서 주입받은 ObservableObject를 감시**하고,  
그 안의 `@Published` 프로퍼티 변화가 **UI 업데이트로 이어지도록 연결**해주는 역할.

---

## @StateObject 🗂
- 뷰 안에서 **ObservableObject 인스턴스를 직접 생성**할 때 사용.  
- 뷰가 사라지기 전까지 인스턴스를 유지한다.  
- @ObservedObject의 인스턴스 초기화 문제(뷰 리렌더링 시 재생성)를 해결하기 위한 방법.  
- 한 뷰에서 ObservableObject를 "처음으로" 만들 때 적합하다.  

---

## @Environment 🌍
- **시스템에서 미리 정의한 공유 데이터**에 접근할 때 사용.  
- 예: 색상 모드(`colorScheme`), 레이아웃 방향 등.  
- 뷰가 생성될 때 자동으로 초기화되고, 값이 변하면 뷰가 다시 업데이트된다.  
```swift
struct ContentView: View {
 @Environment(\.colorScheme) var colorScheme

 var body: some View {
  Text ("Hello, world!")
   •foregroundColor(colorScheme == .dark? white: black)
  }
 }
```

- 뷰에서 **시스템에서 미리 정의된 공유 데이터**를 꺼내 쓸 때 사용  
- 앱 전역에서 이미 존재하는 **설정 값이나 환경 값**을 뷰 안에서 바로 가져다 쓸 수 있음  
- `@Environment(\.colorScheme)`처럼 **KeyPath**를 통해 원하는 시스템 값에 접근  
- 뷰가 생성되는 순간 값이 자동으로 초기화되며, 값이 바뀌면 **뷰도 자동으로 다시 렌더링**  

👉 정리하면,  
`@Environment`는 **시스템 공유 데이터를 뷰에서 쉽게 활용**하고, 값이 바뀌면 **UI가 자동으로 업데이트**되도록 해준다.

---

## @EnvironmentObject 🌐
- **ObservableObject 인스턴스를 앱 전역에서 공유**할 수 있도록 해준다.  
- `environmentObject()`로 한 번 주입하면, 하위 뷰 어디서든 @EnvironmentObject로 선언만 해서 접근 가능.  
- 값이 바뀌면 연결된 모든 뷰가 동시에 업데이트된다.

**\[1번 코드\]**
```swift
class Info: ObservableObject {
 @Published var age = 10
}
```
**\[2번 코드\]**

```swift
@main
struct MyApp: App {
 var body: some Scene {
  WindowGroup {
   MainView()
    •environmentObject (Info())
  }
 }
}
```
**\[3번 코드\]**

```swift
struct MainView: View {
 @EnvironmentObject var info: Info
 
 var body: some View {
  Button(action: {
   self.info.age += 1
  }) {
    Text ("Click Me for plus age")
  }
  SubView()
 }
}
```
### @EnvironmentObject 정리

- **ObservableObject 인스턴스를 앱 전역에서 공유**하여 사용할 수 있는 도구  
- 특정 뷰에 직접 주입하지 않고, 환경에 심어두어 **필요한 뷰 어디서든 접근 가능**  
- 루트 뷰에서 `.environmentObject()`로 인스턴스를 주입하면, 하위 뷰는 `@EnvironmentObject`로 선언만 해도 접근 가능  
- 내부 프로퍼티가 `@Published`라면 값이 변경될 때 **모든 관련 뷰가 자동으로 업데이트**  

#### 코드흐름

1. **클래스 정의**  
   `Info` 클래스가 `ObservableObject`를 채택하고, `age`에 `@Published` 선언 → 값 변경 시 알림 발생  

2. **루트 뷰에서 주입**  
   `MainView()` 생성 시 `.environmentObject(Info())`를 통해 환경에 주입  

3. **하위 뷰에서 사용**  
   `@EnvironmentObject var info: Info`로 선언 → 주입된 인스턴스를 바로 사용 가능  
   → `info.age` 값 변경 시, 공유된 모든 뷰 UI 자동 갱신  

👉 정리하면, `@EnvironmentObject`는 **앱 전역 데이터 공유 + 자동 UI 갱신**을 동시에 가능하게 하는 SwiftUI 전용 도구다.

---

## 전체정리 📝
- **@State / @Binding** → 뷰 내부 상태 & 뷰 간 상태 전달  
- **ObservableObject / @Published** → 데이터 모델을 감시하고 변경 알림 발행  
- **@ObservedObject / @StateObject** → 뷰에서 ObservableObject 관리 방식  
- **@Environment / @EnvironmentObject** → 전역 환경 값 및 공유 데이터 접근  

👉 SwiftUI 상태 관리를 이해하려면,  
이 Property Wrappers들의 역할과 쓰임새를 확실히 구분하는 게 핵심이다 🚀
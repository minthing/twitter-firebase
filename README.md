### setting
* 리엑트 앱 만들기 : `npx create-react-app twitter-firebase`
* firebase : 실습을 용이하게 하기 위해 `npm install firebase@8.10.0`으로 설치
* `firebase.js`에서 `import firebase from 'firebase/app'`로 해야 실행됨 (공식문서 참조)

##### `.env` 파일로 관리하기
Create react app(CRA)로 생성된 앱에서 전역설정과 같은 환경변수를 사용하기 위해 사용함
앱의 버전정보, api 주소, 타이틀 등 정보를 jsx, html 파일에서 전역변수처럼 사용할 수 있음.
리엑트의 경우 변수의 앞에는 반드시 `REACT_APP_`으로 시작해야 함

##### router setting
react-router-dom : `npm i react-router-dom@5.3.0`으로 설치
doc link : https://v5.reactrouter.com/web/guides/quick-start

* `<Route>` : 요청받은 pathname에 해당하는 컴포넌트를 렌더링함.
* `<Switch>` path의 충돌이 일어나지 않게 `<Route>`들을 관리. `<Swtich>` 내부에 `<Route>`들을 넣으면 요청에 의해 매칭되는 `<Route>`들이 다수 있을 때에 제일 처음 매칭되는 `<Route>`만 선별하여 실행하기 때문에 충돌 오류를 방지해주며, `<Route>`간에 이동 시 발생할 수 있는 충돌도 막아줌

```javascript
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
```
##### issue
* 에러났을 땐 껐다 키자 그냥... 재실행 안됨
* 각 컴포넌트에 `return` 잊지 말고 넣어주기

### authentication
doc : https://firebase.google.com/docs/auth
firebase 인증을 사용하려면 `import firebase/auth`를 해주어야 함
* `setPersistence` : 사용자를 어떻게 기억할 것인지 정함
* `onAuthStateChanged` : firebase가 작동할때까지 브라우저가 기다려주지 않으니까... 얘를 사용해서 체크
* login 파트 다시 볼 것 `prev => !prev`로 `setNewAccount`내의 로직 바꾸는 내용 익숙해지기....
* 후기: 와 재밌다... 로그인 구현이 세상에서 제일 재밌어~~~

### database
* cloud firebase는 No SQL database이다.

##### javascript map
```javascript
const array1 = [1, 4, 9, 16];
// pass a function to map
const map1 = array1.map(x => x * 2);
console.log(map1);
// expected output: Array [2, 8, 18, 32]
```

##### 이슈
```javascript
{tweets.map(data => 
  {<div key={data.id}><p>{data.tweet}</p></div>} 
  //{} 중괄호로 감싸니까 못읽음... 안되나봄...()는 됨...
)}
```
* `onChange` input에 꼭 연결시켜주기~~~ 안그럼 값 안바뀜!

### file upload

```html
<input onChange={onFileChange} type="file" accept="image"/>
```

이렇게 불러온 이미지를 다음을 통해 확인할 수 있음...! 처음 알았음...! 개발자로서 지금까지 뭘 한거야...?!!

```javascript
console.log(event.target.files);
```

* fragment는 대체 언제 필요한거임?

##### ref
https://firebase.google.com/docs/reference/js/v8/firebase.storage.Reference

* 이슈 수정

`firebase > storage > rule` 가서 규칙 수정 후 1분 대기

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### change profile
* 이슈 : `setLoggedIn` 삭제 안하고 그대로 쓸 경우, google 로그인 같은 소셜로그인 사용 중에는 userObject가 생성되는 속도가 느리므로 로그인 시도시 오류 발생함 -> `isLoggedIn={Boolean(userObject)}`을 통해 userObject가 생성되었는가를 통해 판단하는게 추후의 오류를 방지할 수 있음
* `Can't perform a React state update on an unmounted component` 이거 해결해야 함...
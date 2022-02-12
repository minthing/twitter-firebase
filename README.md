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
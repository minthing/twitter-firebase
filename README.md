### setting
* 리엑트 앱 만들기 : `npx create-react-app twitter-firebase`
* firebase : 실습을 용이하게 하기 위해 `npm install firebase@8.10.0`으로 설치
* `firebase.js`에서 `import firebase from 'firebase/app'`로 해야 실행됨 (공식문서 참조)

##### issue
* 에러났을 땐 껐다 키자 그냥... 재실행 안됨

### `.env` 파일로 관리하기
Create react app(CRA)로 생성된 앱에서 전역설정과 같은 환경변수를 사용하기 위해 사용함
앱의 버전정보, api 주소, 타이틀 등 정보를 jsx, html 파일에서 전역변수처럼 사용할 수 있음.
리엑트의 경우 변수의 앞에는 반드시 `REACT_APP_`으로 시작해야 함
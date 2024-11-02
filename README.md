## Pre requisites

- Node
- React native android setup - [Installation guide](https://reactnative.dev/docs/environment-setup)

## Run project in development

Clone the repository and run the following commands to run the app in your local setup.

- Install dependencies

  > npm install


- Run on Android

  > npm run android


- To start metro server (if it doesn't start automatically)

  > npm start

## How to compile APK?

Steps to build debug APK

Note: Please don't push the files generated while compiling the js assets.

- Compile JS assets. (Run this on the root directory)

  > npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

- Clean previous builds

  > cd android && ./gradlew clean

- Build debug APK

  > ./gradlew assembleDebug
Android Development Environment
1.	Install Android Studio
2.	Install the Android SDK
3.	Configure the ANDROID_HOME environment variable
4.	Add platform-tools to Path
  a. Open the Windows Control Panel.
  b.	Click on User Accounts, then click User Accounts again
  c.	Click on Change my environment variables
  d.	Select the Path variable.
  e.	Click Edit.
  f.	Click New and add the path to platform-tools to the list.

## In- app cleaning code is in admin.js 

Contact info:
E-mail: shekarbabudevalla@gmail.com









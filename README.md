# Charge SDK

React TS Runtime is a package that contains all the tooling you need to build your React project written in TypeScript.

# Usage

```
npx charge-sdk create
```

# Setup

```bash
mkdir yourproject
cd yourproject
npm init -y
npm install charge-sdk --save-dev
```

Create an [src/index.tsx](/demos/single-page-react/src/index.tsx)

Create an [src/index.html](/demos/single-page-react/src/index.html)

Set the scripts section to the following in your package.json

```json
{
    "start": "charge-sdk run",
    "build": "charge-sdk build",
}
```

Run ```npm start``` to start the project up in development mode.

Run ```npm run build``` to build the project.

# Demos

[Single page React application](/demos/single-page-react/)

[Server side rendering](/demos/server-side-rendering/)
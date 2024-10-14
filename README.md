# hotel

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
- Uses `eslint`
-- See `./.eslintrc.js
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Documentation
Most main documentation can be found in [the front end library `teahub`](https://github.com/twoody/teahub).

`teahub` is maintained by the same author as this project. The purpose of having the components live in this
isolated library is because many of the components were used between different applications.
And when one application bug needed fixed, it had to be commited twice. 

## Hosting
Hosting is done on `firebase`.
**There is a github workflow enabled on the `main` branch to deploy to production when merged and pushed to `remote`.**
- See `.github/workflows/`

- Helpful commands involve:
-- `npm ci && npm run build && firebase deploy --only hosting`

### Troubleshooting
If issues arise when trying to `firebase projects:list` or `firebase login`, try to reauth:
- `firebase login --reauth`

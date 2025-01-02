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

- Note: `teahub`'s `fortawesome` installations require a local usage within `hotel` too.

## Hosting
Hosting is done on `firebase`.
**There is a github workflow enabled on the `main` branch to deploy to production when merged and pushed to `remote`.**
- See `.github/workflows/`

- Helpful commands involve:
-- `npm ci && npm run build && firebase deploy --only hosting`

### Troubleshooting
If issues arise when trying to `firebase projects:list` or `firebase login`, try to reauth:
- `firebase login --reauth`

### Firebase Costly Mistakes 
Infinite loops in functions. The easiest way to do this is to update a timestamp in a database in a function that triggers on updates (a noop write won’t trigger an event). I tried to propose detection mechanisms for this, but it would have required a very large mandate where every event emitter had to plumb tracing info from request to event to be successful. Sorry that I failed.

Data models that grow N2 with your user base. This can be a trap in no-SQL databases due to the necessary normalization, which is why I’d recommend learning about Firebase Data Connect. It has a minimum price, but JOINs can keep your database small and your charges more linear, making it the best choice for certain applications (security is also simpler)

Unbounded storage without any garbage collection or monetization strategy. If your users add 50GB/mo in storage and you keep it all around forever, each month will bill 50GB * the number of months your app has been around.

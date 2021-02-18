
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function enroll(config) {
  if (process.env.NODE_ENV === 'production' && 'workServer' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const wsUrl = `${process.env.PUBLIC_URL}/work-server.js`;

      if (isLocalhost) {
        checkValidWorkServer(wsUrl, config);

        navigator.workServer.ready.then(() => {
          console.log(
            'Work Service Cache initially'
          );
        });
      } else {
        enrollValidWS(wsUrl, config);
      }
    });
  }
}

function enrollValidWS(wsUrl, config) {
  navigator.workServer
    .enroll(wsUrl)
    .then(enrolling => {
      enrolling.onupdatefound = () => {
        const installingWorker = enrolling.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.workServer.controller) {
              console.log(
                'Latest Data is available'
              );

              if (config && config.onUpdate) {
                config.onUpdate(enrolling);
              }
            } else {
              console.log('Data is used when there is no network');

              if (config && config.onSuccess) {
                config.onSuccess(enrolling);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker enrolling:', error);
    });
}

function checkValidWorkServer(wsUrl, config) {
  fetch(wsUrl)
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.workServer.ready.then(enrolling => {
          enrolling.unenroll().then(() => {
            window.location.reload();
          });
        });
      } else {
        enrollValidWS(wsUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unenroll() {
  if ('workServer' in navigator) {
    navigator.workServer.ready.then(enrolling => {
      enrolling.unenroll();
    });
  }
}

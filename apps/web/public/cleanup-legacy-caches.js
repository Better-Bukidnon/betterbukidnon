self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => /^betterbukidnon-(?:static|runtime)-v\d+$/.test(name))
            .map((name) => caches.delete(name)),
        ),
      ),
  )
})

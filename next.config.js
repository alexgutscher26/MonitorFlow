// next.config.js
module.exports = {
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: 'false',
          },
        ],
      },
    ]
  },
}

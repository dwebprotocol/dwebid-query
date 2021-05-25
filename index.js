import { USwarm } from '@uswarm/core'

export default class IdQuery {
  constructor (username) {
    this.dht = new USwarm({
      ephemeral: true
    })
    this.username = username
  }
  async getRemoteKey (type) {
    const { dht, username } = this
    const uB = Buffer.from(username)
    return new Promise((resolve, reject) => {
      dht.on('listening', uB => {
        dht.muser.get(uB, (err, value) => {
          if (err) return reject(new Error(err))
          if (value) {
            if (type === 'dk') {
              const { dk } = value
              return resolve(dk)
            } else {
              const { publicKey }  = value
              return resolve(publicKey)
            }
          }
        })
      })
    })
  }
  checkUserAvailability () {
    const { dht, username } = this
    const uB = Buffer.from(username)
    dht.on('listening', uB => {
      dht.muser.get(uB, (err, value) => {
        if (err) return true
        else return false
      })
    })
  }
}

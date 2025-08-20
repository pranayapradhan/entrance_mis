class ResponseService {
    #data
    #message
    #status
    #options

    constructor(res){
        this.res = res
    }

    setData(data){
        this.#data = data
        return this
    }

    setMessage(message){
        this.#message = message
        return this
    }
    setStatus(status){
        this.#status = status
        return this
    }
    setoptions(options){
        this.#options = options
        return this
    }

    send = () => {
        this.res.json({
            data: this.#data,
            message: this.#message,
            status: this.#status,
            options: this.#options
        })
    }
}

export default ResponseService
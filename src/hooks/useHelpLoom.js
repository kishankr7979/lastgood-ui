import { useEffect } from "react"

const useHelpLoom = () => {

    useEffect(() => {
        const script = document.createElement('script')
        script.src = "/helploom.js"
        script.type = "text/javascript"
        document.body.appendChild(script)
    }, [])
}

export default useHelpLoom
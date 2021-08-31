function injectTag(fibonacciResult, className) {
    const createItem = document.createElement('li')
    createItem.setAttribute('class', className)
    createItem.innerHTML = fibonacciResult
    const fiboList = document.getElementById('results')
    return fiboList.appendChild(createItem)
}

function isPrime(n) {
    if (n < 2) return false
    const num = Math.floor(Math.sqrt(n))
    for (let i = 2; i <= num; i++) {
        if (n % i == 0) {
            return false
        }
    }
    return true
}

function calFibonacci(n) {
    const fib = []
    fib[0] = 0
    fib[1] = 1
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 2] + fib[i - 1]
    }
    return fib[n]
}

const calculateFibonacci = () => {
    try {
        const payload = fibonacci.value
        const fibValue = parseInt(payload)
        let fibonacciResult = 0

        if (fibValue >= 0) {
            fibonacciResult = calFibonacci(fibValue)
        }

        const textToInsert = `The Fibonacci of ${fibValue} is ${fibonacciResult}.`
        const isPrimeNumber = isPrime(fibonacciResult)

        if (isPrimeNumber) {
            injectTag(textToInsert, 'is-prime')
        } else {
            injectTag(textToInsert, 'not-prime')
        }
        document.getElementById('fibonacci').value = ''
    } catch (error) {
        const elem = document.getElementById('error')
        elem.style.display = 'block'
        document.getElementById('error').innerHTML =
            'Something went wrong! Try again.'
    }
}

window.onload = () => {
    fibonacciForm.addEventListener('submit', (e) => {
        e.preventDefault()
        calculateFibonacci()
    })
}

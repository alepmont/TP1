/**
 * Circuit breaker sencillo para llamadas HTTP. Mantiene estado abierto/cerrado/half-open.
 * Implementación didáctica, no para producción.
 */
class CircuitBreaker {
  constructor({failureThreshold = 3, successThreshold = 2, timeout = 5000} = {}){
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }

  async call(action){
    if(this.state === 'OPEN'){
      if(Date.now() > this.nextAttempt){
        this.state = 'HALF';
      } else {
        const err = new Error('Circuit is open');
        err.code = 'EOPEN';
        throw err;
      }
    }

    try{
      const result = await action();
      this._onSuccess();
      return result;
    } catch(err){
      this._onFailure();
      throw err;
    }
  }

  _onSuccess(){
    if(this.state === 'HALF'){
      this.successCount += 1;
      if(this.successCount >= this.successThreshold){
        this._reset();
      }
    } else {
      this._reset();
    }
  }

  _onFailure(){
    this.failureCount += 1;
    if(this.failureCount >= this.failureThreshold){
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }

  _reset(){
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
  }
}

module.exports = CircuitBreaker;

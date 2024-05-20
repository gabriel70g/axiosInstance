const { expect } = require('chai');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const createAxiosInstance = require('../src/axiosInstance');
const sinon = require('sinon');

// Simula las variables de entorno
process.env.EXCLUDE_PATTERNS = '/auth,/sensitive-data,/users/\\d+/profile';

describe('Axios Instance', () => {
  let mock;
  let axiosInstance;

  beforeEach(() => {
    // Crear una instancia de Axios con una URL base específica
    axiosInstance = createAxiosInstance('https://api.example.com');
    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should log request and response for non-excluded routes', async () => {
    mock.onGet('/some-endpoint').reply(200, { data: 'some data' });

    const consoleLogStub = sinon.stub(console, 'log');

    const response = await axiosInstance.get('/some-endpoint');

    expect(consoleLogStub.calledWithMatch('Request:')).to.be.true;
    expect(consoleLogStub.calledWithMatch('Response:')).to.be.true;

    consoleLogStub.restore();
  });

  it('should not log request and response for excluded routes', async () => {
    mock.onGet('/auth').reply(200, { data: 'auth data' });

    const consoleLogStub = sinon.stub(console, 'log');

    const response = await axiosInstance.get('/auth');

    expect(consoleLogStub.calledWithMatch('Request:')).to.be.false;
    expect(consoleLogStub.calledWithMatch('Response:')).to.be.false;

    consoleLogStub.restore();
  });
});

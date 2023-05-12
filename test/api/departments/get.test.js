const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/departments', () => {

  const departmentId = '5d9f1140f10a81216cfd4408';
  const departmentId2 = '5d9f1159f81ce8d1ef2bee48';
  const incorrectDepartmentId = '5d9f1140f10a81216cfd4409';
  const departmentName = 'Department #1';
  const departmentName2 = 'Department #2';

  before(async () => {
    const testDepOne = new Department({_id: departmentId, name: departmentName });
    await testDepOne.save();
  
    const testDepTwo = new Department({ _id: departmentId2, name: departmentName2 });
    await testDepTwo.save();
  });
  
  after(async () => {
    await Department.deleteMany();
  });

  it('/ should return all departments', async () => {
    const res = await request(server).get('/api/departments');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);

    expect(res.body[0]).to.have.property('_id', departmentId);
    expect(res.body[0]).to.have.property('name', departmentName);
    expect(res.body[1]).to.have.property('_id', departmentId2);
    expect(res.body[1]).to.have.property('name', departmentName2);
  });

  it('/:id should return one department by :id ', async () => {
    const res = await request(server).get(`/api/departments/${departmentId}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
    expect(res.body._id).to.be.equal(departmentId);
    expect(res.body.name).to.be.equal(departmentName);
  });

  it('/:id should return error if id is incorrect', async () => {
    const res = await request(server).get(`/api/departments/${incorrectDepartmentId}`);
    expect(res.status).to.be.equal(404);
  });
  
  it('/random should return one random department', async () => {
    const res = await request(server).get('/api/departments/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });
});
const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
    });

    it('Should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('Should return a proper document by "firstName" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'FirstName #1' });
      const expectedName = 'FirstName #1';
      expect(employee.firstName).to.be.equal(expectedName);
    });   
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await employee.save();
      const savedEmployee = await Employee.findOne({ lastName: 'LastName #1' });
      expect(employee.isNew).to.be.false;

      after(async () => {
        await Employee.deleteMany();
      });
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('Should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'FirstName #1' }, { $set: { firstName: '=FirstName #1=', lastName: '=LastName #1=' }});
      const updateEmployee = await Employee.findOne({ firstName: '=FirstName #1=' });
      expect(updateEmployee).to.not.be.null;
    });

    it('Should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'FirstName #1' });
      employee.firstName = '=FirstName #1=';
      employee.lastName = '=LastName #1=';
      await employee.save();

      const updateEmployee = await Employee.findOne({ firstName: '=FirstName #1=', lastName: '=LastName #1=' });
      expect(updateEmployee).to.not.be.null;
    });

    it('Should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find({ firstName: 'Updated!'});
      expect(employees.length).to.be.equal(2);
    });
  });

   describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('Should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'FirstName #1' });
      const removeEmployee = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(removeEmployee).to.be.null;
    });

    it('Should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ lastName: 'LastName #1' });
      await employee.remove();
      const removeEmployee = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(removeEmployee).to.be.null;
    });

    it('Should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
});

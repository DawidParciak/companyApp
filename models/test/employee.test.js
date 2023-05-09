const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if no "firstName", "lastName" or "department" arg', () => {
    const emp = new Employee({});
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName", "lastName" or "department" are not a string', () => {
    const cases = [{}, []];
    for(let firstName of cases) {
      const emp = new Employee({ firstName });
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
      });
    };
    for(let lastName of cases) {
      const emp = new Employee({ lastName });
      emp.validate(err => {
      });
    };
    for(let department of cases) {
      const emp = new Employee({ department });
      emp.validate(err => {
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if everything is okay', () => {
    const employee = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      department: 'IT'
    });
    const err = employee.validateSync();
    expect(err).to.not.exist;
  });

  after(() => {
    mongoose.models = {};
  });
});

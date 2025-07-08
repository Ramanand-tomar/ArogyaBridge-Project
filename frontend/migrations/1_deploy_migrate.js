const PatientRegistration = artifacts.require("PatientRegistration");

module.exports = function(deployer) {
  deployer.deploy(PatientRegistration);
};
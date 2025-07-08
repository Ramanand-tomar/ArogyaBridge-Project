const DiagnosisRegistration = artifacts.require("DiagnosisRegistration");

module.exports = function (deployer) {
  deployer.deploy(DiagnosisRegistration);
};

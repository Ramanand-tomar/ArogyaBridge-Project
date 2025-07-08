// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DiagnosisRegistration {
     struct Diagnostic {
        address walletAddress;
        string diagnosticName;
        string hospitalName;
        string diagnosticLocation;
        string email;
        string hhNumber;
        string password;
    }

    mapping(string => address) private diagnosticAddresses;
    mapping(string => Diagnostic) private diagnostics;

    string[] public allDiagnosticHHNumbers;
    

    event DiagnosticRegistered(string hhNumber, string diagnosticName, address walletAddress);

    function registerDiagnostic(
        string memory _diagnosticName,
        string memory _hospitalName,
        string memory _diagnosticLocation,
        string memory _email,
        string memory _hhNumber,
        string memory _password
    ) external {
        require(diagnosticAddresses[_hhNumber] == address(0), "Diagnostic already registered");

        Diagnostic memory newDiagnostic = Diagnostic({
            walletAddress: msg.sender,
            diagnosticName: _diagnosticName,
            hospitalName: _hospitalName,
            diagnosticLocation: _diagnosticLocation,
            email: _email,
            hhNumber: _hhNumber,
            password: _password
        });

        diagnostics[_hhNumber] = newDiagnostic;
        diagnosticAddresses[_hhNumber] = msg.sender;
        allDiagnosticHHNumbers.push(_hhNumber);
        emit DiagnosticRegistered(_hhNumber, _diagnosticName, msg.sender);
    }

    function getAllDiagnostics() external view returns (
        
        string[] memory diagnosticNames,
        string[] memory hospitalNames,
        string[] memory diagnosticLocations,
        string[] memory emails,
        string[] memory hhNumbers
    ) {
        uint256 len = allDiagnosticHHNumbers.length;
        diagnosticNames = new string[](len);
        hospitalNames = new string[](len);
        diagnosticLocations = new string[](len);
        emails = new string[](len);
        hhNumbers = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            string memory hh = allDiagnosticHHNumbers[i];
            Diagnostic memory diagnostic = diagnostics[hh];
            diagnosticNames[i] = diagnostic.diagnosticName;
            hospitalNames[i] = diagnostic.hospitalName;
            diagnosticLocations[i] = diagnostic.diagnosticLocation;
            emails[i] = diagnostic.email;
            hhNumbers[i] = diagnostic.hhNumber;
        }
        return (
            diagnosticNames,
            hospitalNames,
            diagnosticLocations,
            emails,
            hhNumbers
        );
    }

// ...existing code...

    function isRegisteredDiagnostic(string memory _hhNumber) external view returns (bool) {
        return diagnosticAddresses[_hhNumber] != address(0);
    }

    function getDiagnosticDetails(string memory _hhNumber) external view returns (
        address _walletAddress,
        string memory _diagnosticName,
        string memory _hospitalName,
        string memory _diagnosticLocation,
        string memory _email
    ) {
        require(diagnosticAddresses[_hhNumber] != address(0), "Diagnostic not registered");
        Diagnostic memory diagnostic = diagnostics[_hhNumber];
        return (
            diagnostic.walletAddress,
            diagnostic.diagnosticName,
            diagnostic.hospitalName,
            diagnostic.diagnosticLocation,
            diagnostic.email
        );
    }

    function validatePassword(string memory _hhNumber, string memory _password) external view returns (bool) {
        require(diagnosticAddresses[_hhNumber] != address(0), "Diagnostic not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(diagnostics[_hhNumber].password));
    }
}

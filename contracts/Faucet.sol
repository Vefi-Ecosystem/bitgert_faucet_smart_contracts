pragma solidity ^0.8.0;

import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './helpers/TransferHelpers.sol';

contract Faucet is Ownable, Pausable, AccessControl {
  using SafeMath for uint256;

  bytes32 public constant dispenserRole = keccak256(abi.encodePacked('DISPENSER_ROLE'));
  mapping(address => uint256) lastDispenseTime;

  event Dispensed(address token, address to, uint256 amount);

  constructor() {
    _grantRole(dispenserRole, _msgSender());
  }

  function dispense(
    address to,
    address token,
    uint256 amount
  ) external whenNotPaused {
    require(hasRole(dispenserRole, _msgSender()), 'only_dispenser');
    require(
      block.timestamp > lastDispenseTime[to] && block.timestamp.sub(lastDispenseTime[to]) >= 24 hours,
      'must_be_called_within_24_hours'
    );
    if (token == address(0)) {
      TransferHelpers._safeTransferEther(to, amount);
    } else {
      TransferHelpers._safeTransferERC20(token, to, amount);
    }
    lastDispenseTime[to] = block.timestamp;
    emit Dispensed(token, to, amount);
  }

  function addDispenser(address account) external onlyOwner {
    require(!hasRole(dispenserRole, account), 'already_dispenser');
    _grantRole(dispenserRole, account);
  }

  function removeDispenser(address account) external onlyOwner {
    require(hasRole(dispenserRole, account), 'not_dispenser');
    _revokeRole(dispenserRole, account);
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }
}

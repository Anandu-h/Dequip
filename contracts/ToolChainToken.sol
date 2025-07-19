// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ToolChainToken is ERC20, Ownable, ReentrancyGuard {
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 pendingRewards;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public achievements;
    
    uint256 public constant DAILY_REWARD_RATE = 100; // 1% daily
    uint256 public constant ACHIEVEMENT_REWARD = 1000 * 10**18; // 1000 TOOL tokens
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event AchievementUnlocked(address indexed user, uint256 achievementId, uint256 reward);

    constructor() ERC20("ToolChain Token", "TOOL") {
        _mint(msg.sender, 1000000000 * 10**decimals()); // 1 billion tokens
    }

    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards();
        }

        _transfer(msg.sender, address(this), _amount);

        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastRewardTime = block.timestamp;
        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external nonReentrant {
        require(stakes[msg.sender].amount >= _amount, "Insufficient staked amount");

        // Claim pending rewards first
        _claimRewards();

        stakes[msg.sender].amount -= _amount;
        totalStaked -= _amount;

        _transfer(address(this), msg.sender, _amount);

        emit Unstaked(msg.sender, _amount);
    }

    function claimRewards() external nonReentrant {
        _claimRewards();
    }

    function _claimRewards() internal {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No staked amount");

        uint256 timeStaked = block.timestamp - userStake.lastRewardTime;
        uint256 dailyReward = (userStake.amount * DAILY_REWARD_RATE) / 10000;
        uint256 reward = (dailyReward * timeStaked) / 1 days;

        if (reward > 0) {
            userStake.lastRewardTime = block.timestamp;
            userStake.pendingRewards = 0;
            
            _mint(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }
    }

    function unlockAchievement(address _user, uint256 _achievementId) external onlyOwner {
        require(achievements[_user] & (1 << _achievementId) == 0, "Achievement already unlocked");
        
        achievements[_user] |= (1 << _achievementId);
        _mint(_user, ACHIEVEMENT_REWARD);
        
        emit AchievementUnlocked(_user, _achievementId, ACHIEVEMENT_REWARD);
    }

    function getPendingRewards(address _user) external view returns (uint256) {
        StakeInfo memory userStake = stakes[_user];
        if (userStake.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - userStake.lastRewardTime;
        uint256 dailyReward = (userStake.amount * DAILY_REWARD_RATE) / 10000;
        return (dailyReward * timeStaked) / 1 days;
    }

    function hasAchievement(address _user, uint256 _achievementId) external view returns (bool) {
        return achievements[_user] & (1 << _achievementId) != 0;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
}

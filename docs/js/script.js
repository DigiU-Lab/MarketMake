
var vm = new Vue({
    el: '#app',
    data: {
      chains: [{id:0x4, name:"Ethereum rinkeby", icon:"ethereum.png", web:"web3eth"}, {id:0x61, name:"BSC testnet", icon:"bsc.webp",web:"web3bsc"}],
      tokensEth: [{symbol:"AAVE",addr:"0x918809f0c1d4c5e56328742406ddbf6bf7807c73",icon:"dai.webp",price:1}], //price bypass{symbol:"USDT",addr:"",icon:"tether.webp",price:1} {symbol:"USDC",addr:"0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",icon:"usdc.webp",price:1}
      tokensBsc: [{symbol:"BNB",addr:"0x55797e477BE468855690c660AA2640d3E9F80Cc6",icon:"dai.webp",price:1},{symbol:"dLINK",addr:"0x88e69c0d2d924e642965f8dd151dd2e24ba154f8",icon:"dlink.webp",price:0.1}],//{symbol:"USDC",addr:"0x64544969ed7ebf5f083679233325356ebe738930",icon:"usdc.webp",price:1}
      dexPoolETH:[{addr:"0x9f9A020ef5f14b126e2d76BD984a88a0ba9c89aA"}],
      dexPoolBSC:[{addr:"0x0B998d26B8Ab9e1caaf084Ba30ac6859Adcc236E"}],
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
      balanceFrom:'-',
      balanceTo:'-',
      balanceLiqEth:'-',
      balanceLiqBsc:'-',
      dexPoolContract:'',
      tokenContract:'',

    },
    watch: {
      
      amountFrom: function() {
        if (document.activeElement.id == 'num1' ) {
        calcAmount('from');
       
        }
        exchButtons(1,1,'amo')
      }, 
     
      amountTo: function() {
        if (document.activeElement.id == 'num2' ) {
        calcAmount('to')
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
    vm.price = vm.tokenFrom.price/vm.tokenTo.price; 
    calcAmount(ft);
  }

  function calcAmount(ft) {
     if (ft == 'from' && (vm.amountFrom === '' || vm.amountFrom == 0 ) ) {vm.amountTo = ''; return} 
     if (ft == 'to' && (vm.amountTo === '' || vm.amountTo == 0) ) {vm.amountFrom = ''; return}
     
     if (ft == 'from') { vm.amountTo = BigNumber(vm.amountFrom).times(vm.price); } else { vm.amountFrom = BigNumber(vm.amountTo).div(vm.price)} ;

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
      console.log(vm.chainTo.id, vm.chainFrom.id)
      console.log("dcsdccddc")
      // let exToken = vm.tokenTo;
      // setTokenTo(vm.tokenFrom)
      // setTokenFrom(vm.itemsTo)
      
      let chain,balance,amount,token,items;
      chain = vm.chainTo; vm.chainTo = vm.chainFrom; vm.chainFrom = chain;
      balance = vm.balanceTo; vm.balanceTo = vm.balanceFrom; vm.balanceFrom = balance;
      items = vm.itemsTo; vm.itemsTo = vm.itemsFrom; vm.itemsFrom = items;
      token = vm.tokenTo; vm.tokenTo = vm.tokenFrom; vm.tokenFrom = token;
      amount = vm.amountTo; vm.amountTo = vm.amountFrom; vm.amountFrom = amount;
      account = vm.accountTo; vm.accountTo = vm.accountFrom; vm.accountFrom = account;
      // refreshAccountDataEth();
      // refreshAccountDataBsc();
      if (vm.chainFrom.id == '0x61') {
        
         allowanceBsc() 
        } else {
        
           allowanceEth()
        }

  }





function setLiqToken(item, typ) {
  if (typ == 'eth') {vm.tokenLiqEth = item; fetchLiquidityDataEth()}
  else {vm.tokenLiqBsc = item; fetchLiquidityDataBsc()}
  
  //getBalanceFrom()
}


function checkInstall() {
    if (window.ethereum) { 
        window.web3eth = new Web3(ethereum);
        vm.buttonEth = meta2;
    } else { vm.buttonEth = meta1}

    if (window.BinanceChain) {
        window.web3bsc = new Web3(BinanceChain); 
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
      allowanceEth(0)
    });
   

    // Subscribe to networkId change
    ethereum.on("chainChanged", (chainId) => {
      vm.ethChainId = chainId; 
      refreshAccountDataEth();
      allowanceEth(0)
    });
    
    refreshAccountDataEth();
    setInterval(refreshAccountDataEth,10000);
    allowanceEth(0);
    
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
      refreshAccountDataBsc()
      allowanceBsc(0);
    });
    
    BinanceChain.on("chainChanged", (chainId) => {
      vm.bscChainId = chainId;
      refreshAccountDataBsc();
      allowanceBsc(0)
    });

    
    
    refreshAccountDataBsc();
    setInterval(refreshAccountDataBsc,10000);
    allowanceBsc(0);
    
   
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
    
    //exchButtons(1,1,'bsc')
    

    document.getElementById('alertbsc').innerHTML ='';

    }


      
//BLOCKCHAIN integration
//exchange tab
// fetch accounts data
async function fetchSwapDataBsc() {

 
if (vm.chainTo.id == '0x61') {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenTo.addr);
   tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = Math.round(bal*1e-10)/1e8;})
} else {
  const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = Math.round(bal*1e-10)/1e8;})
}

}

async function fetchSwapDataEth() {
 
  if (vm.chainTo.id == '0x4') {
    const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenTo.addr);
    tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = Math.round(bal*1e-10)/1e8;});
} else {
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = Math.round(bal*1e-10)/1e8;})
}

}

//liquidity tab
async function fetchLiquidityDataEth() {
  
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenLiqEth.addr);
  tokenContract.methods.balanceOf(vm.accountEth).call().then(function (bal) {
  vm.balanceLiqEth = Math.round(bal*1e-10)/1e8;})

}

async function fetchLiquidityDataBsc() {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenLiqBsc.addr);
    tokenContract.methods.balanceOf(vm.accountBsc).call().then(function (bal) {
    vm.balanceLiqBsc = Math.round(bal*1e-10)/1e8;})
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
  console.log(`${aa} ${alloEth} ${alloBsc} ${aa == 1 && alloEth*alloBsc == 0}`)
  if (aa == 1 || alloEth*alloBsc == 0 ) document.querySelector("#approve").removeAttribute("disabled"); else {document.querySelector("#approve").setAttribute("disabled", "disabled");}
  console.log(`${ss} ${cc} ${ss == 1 && cc == 1}`)
  if (ss == 1 && cc == 1) document.querySelector("#swap").removeAttribute("disabled"); else document.querySelector("#swap").setAttribute("disabled", "disabled");


  }




//APPROVE

  var alloEth = alloBsc = 0, approveTokenBsc, approveTokenEth;

   async function allowanceBsc(x) {
    console.log(`allowanceBsc(${x})`);
    var tok,acc;
    if (vm.chainFrom.id == '0x61') {tok = vm.tokenFrom.addr; acc = vm.accountFrom;} else { tok = vm.tokenTo.addr; acc = vm.accountTo; }
      const tokenContract = await new web3bsc.eth.Contract(erc20abi, tok);
      if (!x) {
        await tokenContract.methods.allowance(acc,serviceContractBsc).call().then(function (res) {
        console.log("RESULT", res, "token", tok);
        alloBsc = res; 
        if (res == 0) approveTokenBsc = tok; 
        exchButtons(1,1,'bsc')//
      
        }).catch(e=>{});
      } 
       if (x && alloBsc == 0) { 
       /////////
//        let qwe = calcAmount(web3bsc, x);
        await tokenContract.methods.approve(serviceContractBsc, x).send({from:acc}).then(function (res) {//alert(JSON.stringify(res));
        setTimeout(allowanceBsc,1000,0) }).catch(function (e) {});  // 'Seems, insufficient balance to pay Gas'    
  }
  
}

// async function  calcAmount( x) {
//   const tokenDecimals = await web3eth.utils.toBN(18);
//   const tokenAmountToApprove = await web3eth.utils.toBN(x);
//   const calculatedValue = await web3eth.utils.toHex(tokenAmountToApprove.mul(web3bsc.utils.toBN(10).pow(tokenDecimals)));
//   console.log(`calculatedValue ${calculatedValue}`)
//   return calculatedValue;

// }

  async function approving() {
    if (vm.chainTo.id == '0x61') {
    await allowanceEth(1); } else {
     await allowanceBsc(1)
    }

  
  }
  
  var accs;

  //SWAP
  async function confirmSwap() {
    if (alloEth*alloBsc == 0) {
      dexPoolContract = await new web3eth.eth.Contract(dexPoolABI, vm.dexPoolETH[0].addr);

      console.log(`vm.dexPoolETH.addr ${vm.dexPoolETH[0].addr} contract  ${dexPoolContract.address}`)
       const tokenDecimals = await web3eth.utils.toBN(18);
  const tokenAmountToApprove = await web3eth.utils.toBN(1);
  const calculatedValue = await web3eth.utils.toHex(tokenAmountToApprove.mul(web3bsc.utils.toBN(10).pow(tokenDecimals)));
  
      await web3bsc.eth.getAccounts(function(err, accounts) {
         accs = accounts;
         console.log("BSC accounts ",accounts); 
         })
       
      tx = await dexPoolContract.methods.swapDeposit(calculatedValue, accs[0]).send({from:vm.accountFrom});
      console.log(`tx.transactionHash ${tx.transactionHash}`);
      let receipt = await web3eth.eth.getTransactionReceipt(tx.transactionHash);      
      if (receipt != null){
        console.log(receipt);
        document.querySelector("#swap").setAttribute("disabled", "disabled");
        document.querySelector("#approve").removeAttribute("disabled");
        } else {
          console.error("receipt null")
        }
  }
}

async function getAllowanceEth(token) {
    await token.methods.allowance(vm.accountFrom, serviceContractEth);
       console.log("allowance", res, "token", token._address);
        exchButtons(1,1,'eth')
        exchButtons(1,1,'allo')
        alloBsc == 0 
        alloEth = 0;
        // console.log("allowance", res, "token", token._address);
      
       // 


}

function allowanceEth(x) {
    const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenFrom.addr);
    console.log(`vm.tokenFrom.addr ${vm.tokenFrom.addr}`)

    if (!x) {
        getAllowanceEth(tokenContract)
    } else {
        setaAllowanceEth(x, tokenContract)
    }
}

async function setaAllowanceEth(x, tokenContract) {
    console.log(`setaAllowanceEth(${x})`);
    console.log("approve  ------------------->");
    const tokenDecimals = await web3eth.utils.toBN(18);
    const tokenAmountToApprove = await web3eth.utils.toBN(x);
    const calculatedApproveValue = await web3eth.utils.toHex(tokenAmountToApprove.mul(web3eth.utils.toBN(10).pow(tokenDecimals)));
    console.log("approve  ------------------->");
    if (tokenContract === undefined) {
    tokenContract = await new web3eth.eth.Contract(erc20abi, vm.tokenFrom.addr);
   }
    tx = await tokenContract.methods.approve(serviceContractEth, calculatedApproveValue).send({from:vm.accountFrom});
    console.log(`tx.transactionHash ${tx.transactionHash}`);
    let receipt = await web3eth.eth.getTransactionReceipt(tx.transactionHash);
            if (receipt != null){
                console.log(receipt);
                document.querySelector("#swap").removeAttribute("disabled"); 
                } else {
                  console.error("receipt null")
                }
}

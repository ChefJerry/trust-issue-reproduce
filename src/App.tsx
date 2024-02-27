import { FormEvent } from 'react'
import { BaseError, parseAbi, parseEther, stringify } from 'viem'
import { useAccountEffect, useChainId, useConnect, useSignTypedData, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { USDC, typed } from './constants'
import { bscTestnet } from 'viem/chains'

function App() {
  useAccountEffect({
    onConnect(data) {
      console.log('Connected:', data)
    },
    onDisconnect() {
      console.log('Disconnected')
    },
  })

  return (
    <>
      <Connect />
      <SwitchChain />
      <ApproveAllowance />
      <SignTypedData />
    </>
  )
}

const Connect = () => {
  const chainId = useChainId()
  const { connectors, connect, status, error } = useConnect()

  return (
    <div>
      <h2>Connect</h2>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector, chainId })}
          type="button"
        >
          {connector.name}
        </button>
      ))}
      <div>{status}</div>
      <div>{error?.message}</div>
    </div>
  )
}

function SwitchChain() {
  const chainId = useChainId()
  const { switchChain, error } = useSwitchChain()

  return (
    <div>
      <h2>Switch Chain</h2>


      <button
        disabled={chainId === bscTestnet.id}
        key={bscTestnet.id}
        onClick={() => switchChain({ chainId: bscTestnet.id })}
        type="button"
      >
        {bscTestnet.name}
      </button>


      {error?.message}
    </div>
  )
}

const ApproveAllowance = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    writeContract({
      address: USDC,
      abi: parseAbi(['function approve(address,uint256)']),
      functionName: 'approve',
      args: ['0x9A082015c919AD0E47861e5Db9A1c7070E81A2C7', parseEther('1')],
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <div>
      <h2>Approve BSC Testnet USDC</h2>
      <p>faucet: <a href="https://www.bnbchain.org/en/testnet-faucet">https://www.bnbchain.org/en/testnet-faucet</a></p>
      <form onSubmit={submit}>
        <button disabled={isPending} type="submit">
          {isPending ? 'Confirming...' : 'Approve'}
        </button>
      </form>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}

const SignTypedData = () => {
  const { data, signTypedDataAsync } = useSignTypedData()

  return (
    <div>
      <h2>Sign Typed Data</h2>

      <p>Sign the following message:</p>

      <pre style={{ maxHeight: '20vh', overflow: 'scroll', border: '1px solid black' }}>{stringify(typed, null, 2)}</pre>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          signTypedDataAsync(typed)
        }}
      >
        <button type="submit">Sign Typed Data</button>
      </form>

      {data}
    </div>
  )
}


export default App

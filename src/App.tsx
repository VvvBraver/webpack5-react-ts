import React,{ lazy, Suspense, useState } from 'react';
const LazyDemo = lazy(() => import('@/components/LazyDemo')) // 使用import语法配合react的Lazy动态引入资源

// import '@/app.css';
import './app.less';
import smallImg from '@/assets/imgs/5kb.png';
import bigImg from './assets/imgs/26kb.png';

import { Demo1, Demo2 } from '@/components';

function App() {
  const [ count, setCounts ] = useState('');
  const onChange = (e: any) => {
    setCounts(e.target.value)
  };

  const [ show, setShow ] = useState(false)
  
  // 点击事件中动态引入css, 设置show为true
  const onClick = () => {
    import('./app.css')
    setShow(true)
  }

  return (
  <>
    <Demo1 />
    <h2>webpack5-react-ts</h2>

    <h2 onClick={onClick}>展示</h2>
    {/* show为true时加载LazyDemo组件 */}
    { show && <Suspense fallback={null}><LazyDemo /></Suspense> }

    <p>受控组件</p>
    <input type="text" value={count} onChange={onChange} />
    <br />
    <p>非受控组件</p>
    <input type="text" />
  
    <div>
      <img src={smallImg} alt="小于10kb的图片" />
      <img src={bigImg} alt="大于于10kb的图片" />
      <div className='smallImg'></div> {/* 小图片背景容器 */}
      <div className='bigImg'></div> {/* 大图片背景容器 */}
    </div>
  </>
  )
}
export default App
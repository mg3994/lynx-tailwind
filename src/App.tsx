import { useCallback, useEffect, useState } from '@lynx-js/react'

import { ThemeToggle } from './components/ThemeToggle'
import { ColorPicker } from './components/ColorPicker'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

export function App(props: {
  onRender?: () => void
}) {
  const [alterLogo, setAlterLogo] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)

  useEffect(() => {
    console.info('Hello, Manish')
  }, [])
  props.onRender?.()

  const onTapLogo = useCallback(() => {
    'background only'
    setAlterLogo(prevAlterLogo => !prevAlterLogo)
  }, [])

  const toggleThemePanel = useCallback(() => {
    setShowThemePanel(prev => !prev)
  }, [])



  // return (
  //   <view>
  //     <view className='Background' />
  //     <view className='App'>
  //       <view className='Banner'>
  //         <view className='Logo' bindtap={onTap}>
  //           {alterLogo
  //             ? <image src={reactLynxLogo} className='Logo--react' />
  //             : <image src={lynxLogo} className='Logo--lynx' />}
  //         </view>
  //         <text className='Title'>React</text>
  //         <text className='Subtitle'>on Manish</text>
  //       </view>
  //       <view className='Content'>
  //         <image src={arrow} className='Arrow' />
  //         <text className='Description'>Tap the logo and have fun!</text>
  //         <text className='Hint'>
  //           Edit<text
  //             style={{
  //               fontStyle: 'italic',
  //               color: 'rgba(255, 255, 255, 0.85)',
  //             }}
  //           >
  //             {' src/App.tsx '}
  //           </text>
  //           to see updates!
  //         </text>
  //       </view>
  //       <view style={{ flex: 1 }} />
  //     </view>
      
  //   </view>
  // )
   return (
    <view
      className="relative min-h-screen flex flex-col items-center justify-center p-6
                   bg-theme transition-theme overflow-hidden bg-gradient-theme"
    >
      {/* Theme Controls Toggle Button */}
      <view className="absolute top-4 right-4 z-20">
        <view
          bindtap={toggleThemePanel}
          className="btn-primary p-3 rounded-full shadow-theme-lg cursor-pointer"
        >
          <text className="text-lg">🎨</text>
        </view>
      </view>

      {/* Theme Controls Panel */}
      {showThemePanel && (
        <view className="absolute top-4 right-20 z-20 w-80 max-w-[90vw]">
          <view className="card-theme p-6 space-y-6">
            <view className="flex items-center justify-between">
              <text className="text-lg font-semibold text-theme">Theme Settings</text>
              <view
                bindtap={toggleThemePanel}
                className="btn-ghost p-1 text-theme-secondary hover:text-theme cursor-pointer"
              >
                <text>✕</text>
              </view>
            </view>
            
            <view className="space-y-4">
              <view>
                <text className="block text-sm font-medium text-theme mb-2">Theme Mode</text>
                <ThemeToggle variant="segmented" showLabels={true} />
              </view>
              
              <view>
                <ColorPicker 
                  showPreview={true} 
                  showPresets={true}
                  className="w-full"
                />
              </view>
            </view>
          </view>
        </view>
      )}

      {/* Main Content */}
      <view className="flex-[5] flex flex-col items-center justify-center z-10 mb-8 w-full">
        <view
          className="flex flex-col items-center justify-center mb-3
                     transform transition-theme duration-100 ease-in-out active:scale-95"
          bindtap={onTapLogo}
        >
          {alterLogo ? (
            <image
              src={reactLynxLogo}
              className="w-[110px] h-[110px] animate-spin-slow"
            />
          ) : (
            <image
              src={lynxLogo}
              className="w-[110px] h-[110px] animate-shake"
            />
          )}
        </view>
        <text className="text-[40px] font-bold text-primary transition-theme">
          React
        </text>
        <text className="text-[24px] font-semibold italic mb-4 text-secondary transition-theme">
          on Lynx
        </text>
      </view>

      <view className="flex flex-col items-center justify-center z-10 w-full px-4">
        <image src={arrow} className="w-7 h-7 mb-2" />
        <text className="text-xl text-center font-medium text-theme my-3 transition-theme">
          Tap the logo and have fun!
        </text>
        <text className="text-sm text-center text-theme-secondary my-2 transition-theme">
          Edit
          <text className="italic font-mono text-accent mx-1 px-1 bg-muted rounded transition-theme">
            {'src/App.tsx'}
          </text>
          to see updates!
        </text>
        <text className="mt-6 py-2 px-4 bg-surface backdrop-blur-sm text-theme rounded-lg text-sm font-medium shadow-theme transition-theme border border-theme">
          Tailwind CSS is Enhanced with Theme System!
        </text>
        
        {/* Quick Theme Toggle */}
        <view className="mt-4">
          <text className="block text-xs text-theme-secondary mb-2 text-center">Quick Theme Switch</text>
          <ThemeToggle variant="button" showLabels={false} className="mx-auto" />
        </view>
      </view>

      <view className="flex-1"></view>
    </view>
  );
}
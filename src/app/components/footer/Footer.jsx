'use client'

import React, { useState, useEffect } from 'react'
import styles from './footer.module.css'

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getCurrentYear = () => {
    return new Date().getFullYear()
  }

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour < 6) return { greeting: 'Boa madrugada', icon: <img src="/icon/boamadrugada.png" alt="Noite" style={{ width: 24, height: 24 }} />, period: 'noite' }
    if (hour < 12) return { greeting: 'Bom dia', icon: <img src="/icon/bomdia.png" alt="Manhã" style={{ width: 24, height: 24 }} />, period: 'manha' }
    if (hour < 18) return { greeting: 'Boa tarde', icon: <img src="/icon/boatarde.png" alt="Tarde" style={{ width: 24, height: 24 }} />, period: 'tarde' }
    return { greeting: 'Boa noite', icon: <img src="/icon/boanoite.png" alt="Noite" style={{ width: 24, height: 24 }} />, period: 'noite' }
  }

  const timeInfo = getTimeOfDay()

  return (
    <footer className={`${styles.footer} ${styles[timeInfo.period]}`}>
      <div className={styles.footerContent}>
            <div className={styles.mainSection}>
              <div className={styles.brandArea}>
                <div className={styles.logoWrapper}>
                  <div className={styles.logo}>
                <img src='/icon/relogio-semfundo.png' alt="Logo"  style={{ width: 50, height: 50 }} />
                <span className={styles.logoText}>Kairos</span>
                  </div>
                </div>
                
                <div className={styles.liveTime}>
                  <div className={styles.timeDisplay}>
                <span className={styles.timeIcon} style={{ background: 'transparent' }}>{timeInfo.icon}</span>
                <span className={styles.time}>
                  {isClient ? formatTime(currentTime) : '--:--:--'}
                </span>
                  </div>
                  <span className={styles.greeting}>{timeInfo.greeting}</span>
                </div>
              </div>

        
            <div className={styles.linkColumn}>
                <h4>Conecte-se</h4>
                <div className={styles.socialLinks}>
                    <a href="https://github.com/flaviamendes17" className={styles.socialLink} title="GitHub" target="_blank" rel="noopener noreferrer">
                        <img src='/icon/github.png' alt="GitHub" style={{ width: 20, height: 20 }} />
                    </a>
                    <a href="https://linkedin.com/in/flaviamendes17" className={styles.socialLink} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                        <img src='/icon/linkedin.png' alt="LinkedIn" style={{ width: 20, height: 20 }} />
                    </a>
                </div>
        </div>
        </div>
        <div className={styles.bottomSection}>
        <div className={styles.copyright}>
            <span>© {getCurrentYear()} Kairos</span>
            <span className={styles.separator}>•</span>
            <span>Todos os direitos reservados.</span>
        </div>
        
        
        </div>

        <div className={styles.decorativeElement}>
        <div className={styles.wave}></div>
        </div>
    </div>
    </footer>
)
}

export default Footer

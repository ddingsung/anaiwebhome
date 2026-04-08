// components/viewer/PCBSubstrate.tsx
interface Props {
  isNG: boolean
}

export function PCBSubstrate({ isNG }: Props) {
  return (
    <div className="w-full h-full">
      <svg
        viewBox="0 0 800 560"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Board base */}
        <rect x="0" y="0" width="800" height="560" fill="#1a2e1a" />
        <rect x="0" y="0" width="800" height="560" fill="#243824" opacity="0.35" />

        {/* NG tint — 미세하게만 */}
        {isNG && (
          <rect x="0" y="0" width="800" height="560" fill="rgba(180,30,30,0.06)" />
        )}

        {/* Board outline */}
        <rect x="12" y="12" width="776" height="536" fill="none" stroke="#2a4a2a" strokeWidth="1.5" rx="3" />

        {/* Mounting holes */}
        {([[38,38],[762,38],[38,522],[762,522]] as [number,number][]).map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill="#0d0f11" />
            <circle cx={cx} cy={cy} r="11" fill="none" stroke="#9a7a0a" strokeWidth="1" />
          </g>
        ))}

        {/* ===== MAIN MCU (U1) ===== */}
        <rect x="110" y="110" width="170" height="220" fill="#162216" stroke="#9a7a0a" strokeWidth="0.8" />
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={`u1l${i}`} x="96" y={124+i*28} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={`u1r${i}`} x="280" y={124+i*28} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1,2,3,4].map(i => (
          <rect key={`u1t${i}`} x={130+i*28} y="96" width="8" height="14" fill="#9a7a0a" />
        ))}
        {[0,1,2,3,4].map(i => (
          <rect key={`u1b${i}`} x={130+i*28} y="330" width="8" height="14" fill="#9a7a0a" />
        ))}
        <text x="195" y="222" textAnchor="middle" fill="#3a5a3a" fontSize="12" fontFamily="monospace" fontWeight="bold">MCU</text>
        <text x="195" y="238" textAnchor="middle" fill="#3a5a3a" fontSize="8" fontFamily="monospace">STM32H7</text>
        <line x1="155" y1="215" x2="235" y2="215" stroke="#3a5a3a" strokeWidth="0.5" />

        {/* ===== MEMORY (U2) ===== */}
        <rect x="340" y="80" width="140" height="100" fill="#162216" stroke="#9a7a0a" strokeWidth="0.8" />
        {[0,1,2,3].map(i => (
          <rect key={`u2l${i}`} x="326" y={95+i*22} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1,2,3].map(i => (
          <rect key={`u2r${i}`} x="480" y={95+i*22} width="14" height="8" fill="#9a7a0a" />
        ))}
        <text x="410" y="133" textAnchor="middle" fill="#3a5a3a" fontSize="9" fontFamily="monospace">LPDDR4</text>

        {/* ===== POWER IC (U3) ===== */}
        <rect x="560" y="60" width="110" height="80" fill="#162216" stroke="#9a7a0a" strokeWidth="0.8" />
        {[0,1,2].map(i => (
          <rect key={`u3l${i}`} x="546" y={76+i*22} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1,2].map(i => (
          <rect key={`u3r${i}`} x="670" y={76+i*22} width="14" height="8" fill="#9a7a0a" />
        ))}
        <text x="615" y="103" textAnchor="middle" fill="#3a5a3a" fontSize="9" fontFamily="monospace">PMIC</text>

        {/* ===== FPGA (U4) ===== */}
        <rect x="500" y="220" width="160" height="180" fill="#162216" stroke="#9a7a0a" strokeWidth="0.8" />
        {[0,1,2,3,4].map(i => (
          <rect key={`u4l${i}`} x="486" y={236+i*30} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1,2,3,4].map(i => (
          <rect key={`u4r${i}`} x="660" y={236+i*30} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1,2].map(i => (
          <rect key={`u4t${i}`} x={520+i*36} y="206" width="8" height="14" fill="#9a7a0a" />
        ))}
        <text x="580" y="312" textAnchor="middle" fill="#3a5a3a" fontSize="11" fontFamily="monospace" fontWeight="bold">FPGA</text>
        <text x="580" y="326" textAnchor="middle" fill="#3a5a3a" fontSize="8" fontFamily="monospace">Artix-7</text>

        {/* ===== SMALL IC (U5) ===== */}
        <rect x="350" y="240" width="80" height="60" fill="#162216" stroke="#9a7a0a" strokeWidth="0.8" />
        {[0,1].map(i => (
          <rect key={`u5l${i}`} x="336" y={252+i*22} width="14" height="8" fill="#9a7a0a" />
        ))}
        {[0,1].map(i => (
          <rect key={`u5r${i}`} x="430" y={252+i*22} width="14" height="8" fill="#9a7a0a" />
        ))}
        <text x="390" y="273" textAnchor="middle" fill="#3a5a3a" fontSize="8" fontFamily="monospace">CLK</text>

        {/* ===== CIRCUIT TRACES ===== */}
        <path d="M 294 132 L 320 132 L 320 103 L 326 103" fill="none" stroke="#9a7a0a" strokeWidth="1.4" opacity="0.65" />
        <path d="M 294 160 L 326 160 L 326 125 L 326 125" fill="none" stroke="#9a7a0a" strokeWidth="1.4" opacity="0.65" />
        <path d="M 294 236 L 390 236 L 390 300 L 486 300" fill="none" stroke="#9a7a0a" strokeWidth="1.4" opacity="0.65" />
        <path d="M 294 264 L 400 264 L 400 330 L 486 330" fill="none" stroke="#9a7a0a" strokeWidth="1.4" opacity="0.65" />
        <path d="M 294 292 L 336 292 L 336 274" fill="none" stroke="#9a7a0a" strokeWidth="1.2" opacity="0.55" />
        <path d="M 670 88 L 720 88 L 720 40 L 195 40 L 195 96" fill="none" stroke="#9a7a0a" strokeWidth="1.8" opacity="0.4" />
        <path d="M 580 140 L 580 200 L 548 200 L 548 206" fill="none" stroke="#9a7a0a" strokeWidth="1.5" opacity="0.5" />
        <path d="M 430 270 L 460 270 L 460 252 L 486 252" fill="none" stroke="#9a7a0a" strokeWidth="1.2" opacity="0.55" />

        {/* ===== CAPACITORS ===== */}
        {([
          [318,190,true],[318,214,true],[318,238,true],
          [80,200,false],[80,228,false],[80,256,false],
          [660,264,true],[660,292,true],
          [460,190,true],[460,210,true],
        ] as [number,number,boolean][]).map(([x,y,horiz],i) => (
          <rect key={`cap${i}`} x={x} y={y} width={horiz?12:6} height={horiz?5:11} fill="#9a7a0a" opacity="0.75" />
        ))}

        {/* ===== RESISTORS ===== */}
        {([[360,360],[390,360],[420,360],[360,380],[390,380]] as [number,number][]).map(([x,y],i) => (
          <rect key={`res${i}`} x={x} y={y} width="14" height="5" fill="#9a7a0a" opacity="0.6" />
        ))}

        {/* ===== VIAS ===== */}
        {([
          [320,132],[320,160],[390,236],[390,264],[400,264],
          [460,270],[460,252],[720,88],[195,40],[580,200],
          [100,350],[100,380],[100,410],
          [700,170],[700,200],[700,230],
        ] as [number,number][]).map(([cx,cy],i) => (
          <circle key={`via${i}`} cx={cx} cy={cy} r="4" fill="#0d0f11" stroke="#9a7a0a" strokeWidth="1" />
        ))}

        {/* ===== CAMERA CONNECTOR ===== */}
        <rect x="708" y="200" width="50" height="130" fill="#162216" stroke="#9a7a0a" strokeWidth="0.8" />
        {[0,1,2,3,4,5].map(i => (
          <rect key={`cam${i}`} x="758" y={214+i*18} width="18" height="6" fill="#9a7a0a" />
        ))}
        <text x="733" y="268" textAnchor="middle" fill="#3a5a3a" fontSize="7" fontFamily="monospace">CAM</text>

        {/* ===== EDGE CONNECTOR (bottom) ===== */}
        {Array.from({length:22},(_,i) => (
          <rect key={`ec${i}`} x={100+i*26} y="500" width="14" height="32" fill="#9a7a0a" opacity="0.88" rx="1" />
        ))}
        <rect x="88" y="498" width="496" height="36" fill="none" stroke="#9a7a0a" strokeWidth="0.6" opacity="0.4" />

        {/* ===== DEBUG HEADER ===== */}
        {[0,1,2,3,4,5].map(i => (
          <circle key={`hdr${i}`} cx={70+i*14} cy={70} r="4" fill="#0d0f11" stroke="#9a7a0a" strokeWidth="1" opacity="0.8" />
        ))}
        <text x="70" y="88" fill="#2a4a2a" fontSize="7" fontFamily="monospace">JTAG</text>

        {/* ===== SILKSCREEN LABELS ===== */}
        <text x="118" y="106" fill="#2a4a2a" fontSize="7" fontFamily="monospace">U1</text>
        <text x="348" y="76" fill="#2a4a2a" fontSize="7" fontFamily="monospace">U2</text>
        <text x="568" y="56" fill="#2a4a2a" fontSize="7" fontFamily="monospace">U3</text>
        <text x="508" y="216" fill="#2a4a2a" fontSize="7" fontFamily="monospace">U4</text>
        <text x="358" y="236" fill="#2a4a2a" fontSize="7" fontFamily="monospace">U5</text>

        {/* Board rev mark */}
        <text x="720" y="490" fill="#2a4a2a" fontSize="7" fontFamily="monospace">REV.C</text>
      </svg>
    </div>
  )
}

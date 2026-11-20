// All geometry shares one isometric projection. Units are illustrative, not GIS data.
const point = (x, y, z = 0) => [400 + x - y, 190 + (x + y) * 0.48 - z];
const points = (vertices) => vertices.map((v) => point(...v).join(",")).join(" ");
function Face({ vertices, ...props }) {
  return <polygon points={points(vertices)} {...props} />;
}
function Line({ from, to, ...props }) {
  const a = point(...from), b = point(...to);
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...props} />;
}
function Box({ x, y, w, d, h, z = 0, colors = ["#424960", "#282f46", "#596078"], ...props }) {
  return <g {...props}>
    <Face vertices={[[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]]} fill={colors[0]} />
    <Face vertices={[[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]]} fill={colors[1]} />
    <Face vertices={[[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]]} fill={colors[2]} />
  </g>;
}
function Sign({ x, y, z, children, fill = "#ffe2ad", size = 10, ...props }) {
  const [sx,sy] = point(x,y,z);
  return <text transform={`translate(${sx} ${sy}) skewY(25.64)`} textAnchor="middle" fill={fill} fontSize={size} fontWeight="700" letterSpacing="1.5" {...props}>{children}</text>;
}
function Windows({ x, y, w, d, h, floors = 4, columns = 4, tint = "#ffd397" }) {
  return <g className="city-windows">
    {Array.from({length:floors}, (_,row) => Array.from({length:columns}, (_,col) => {
      const z = 23 + row * ((h - 35) / floors);
      const fx = x + 9 + col * ((w-15)/columns);
      const lit = (row * 7 + col * 3) % 5 !== 0;
      return <g key={`${row}-${col}`}>
        <Face vertices={[[fx,y+d+.3,z],[fx+8,y+d+.3,z],[fx+8,y+d+.3,z+13],[fx,y+d+.3,z+13]]} fill={lit ? tint : "#22283e"} className={lit ? "city-window-lit" : undefined} style={{animationDelay:`${row*.7+col*.4}s`}} />
        <Line from={[fx+4,y+d+.5,z]} to={[fx+4,y+d+.5,z+13]} stroke="#35364d" strokeWidth="1.3" />
        <Line from={[fx-1,y+d+.5,z-2]} to={[fx+10,y+d+.5,z-2]} stroke="#9e8b93" strokeWidth="2" />
      </g>;
    }))}
    {Array.from({length:floors}, (_,row) => Array.from({length:3}, (_,col) => {
      const fy=y+10+col*((d-16)/3), z=23+row*((h-35)/floors);
      return <Face key={`side-${row}-${col}`} vertices={[[x+w+.3,fy,z],[x+w+.3,fy+7,z],[x+w+.3,fy+7,z+13],[x+w+.3,fy,z+13]]} fill={(row+col)%3===0?tint:"#20273b"} />;
    }))}
  </g>;
}
function Building({ x,y,w,d,h,colors,floors,columns,tint,children }) {
  return <g>
    <Box x={x-3} y={y-3} w={w+6} d={d+6} h={5} colors={["#454659","#292d41","#626174"]} />
    <Box x={x} y={y} w={w} d={d} h={h} colors={colors} />
    <Windows {...{x,y,w,d,h,floors,columns,tint}} />
    <Box x={x-3} y={y-3} w={w+6} d={d+6} z={h-4} h={6} colors={["#8b8297","#545269","#7c758c"]} />
    <Box x={x+5} y={y+5} w={w-10} d={d-10} z={h+2} h={1} colors={["#33374d","#33374d","#33374d"]} />
    {children}
  </g>;
}
function Tree({x,y}) {
  const [sx,sy]=point(x,y);
  return <g><ellipse cx={sx+4} cy={sy+2} rx="17" ry="7" fill="#111827" opacity=".6" /><Line from={[x,y,0]} to={[x,y,29]} stroke="#826760" strokeWidth="4" /><ellipse cx={sx} cy={sy-34} rx="17" ry="23" fill="#365a58" /><ellipse cx={sx-6} cy={sy-39} rx="10" ry="16" fill="#50786b" /><ellipse cx={sx+7} cy={sy-27} rx="11" ry="15" fill="#294448" /></g>;
}
function WaterTank({ x, y, z }) {
  const [sx, sy] = point(x,y,z);
  return <g>
    <path d={`M${sx-13} ${sy+16}v-21m26 21v-21`} stroke="#a09aaf" strokeWidth="2.5" />
    <path d={`M${sx-16} ${sy-20}v23a16 6 0 0 0 32 0v-23`} fill="#957180" stroke="#6d596d" />
    <path d={`M${sx-16} ${sy-12}a16 6 0 0 0 32 0m-32 10a16 6 0 0 0 32 0`} fill="none" stroke="#c09b9e" strokeWidth="1.2" />
    <path d={`M${sx-20} ${sy-20}Q${sx} ${sy-36} ${sx} ${sy-36}L${sx+20} ${sy-20}Q${sx} ${sy-10} ${sx-20} ${sy-20}`} fill="#665a76" stroke="#95839c" />
  </g>;
}
function Lamp({x,y}) {
  const [sx,sy]=point(x,y,49);
  return <g><ellipse cx={sx} cy={sy+49} rx="23" ry="10" fill="url(#city-pool)" /><Line from={[x,y,0]} to={[x,y,49]} stroke="#9494ae" strokeWidth="2" /><path d={`M${sx} ${sy+5}v-7h9`} fill="none" stroke="#9494ae" strokeWidth="2" /><circle cx={sx+9} cy={sy-2} r="15" fill="url(#city-pool)" /><circle cx={sx+9} cy={sy-2} r="3" fill="#ffe5b6" /></g>;
}
function Location({ id, label, selected, onSelect, children }) {
  return <g className={`city-location ${selected===id ? "is-selected" : ""}`} role="button" tabIndex="0" aria-label={label} aria-pressed={selected===id} aria-controls="city-detail" onClick={(e)=>onSelect(id,e.currentTarget)} onKeyDown={(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onSelect(id,e.currentTarget);}}}>
    {children}
  </g>;
}
export default function CityScene({ selected, onSelect }) {
  const common={selected,onSelect};
  return <svg className="city-svg" viewBox="0 0 850 610" aria-label="Illustrated miniature New York neighborhood. Choose one of four buildings." role="group">
    <defs>
      <radialGradient id="city-pool"><stop stopColor="#ffd498" stopOpacity=".36" /><stop offset="1" stopColor="#ffd498" stopOpacity="0" /></radialGradient>
      <radialGradient id="city-violet"><stop stopColor="#9b7dff" stopOpacity=".22" /><stop offset="1" stopColor="#9b7dff" stopOpacity="0" /></radialGradient>
      <linearGradient id="city-screen"><stop stopColor="#e6b8e5" /><stop offset="1" stopColor="#8875e5" /></linearGradient>
    </defs>
    <ellipse cx="421" cy="437" rx="350" ry="145" fill="url(#city-violet)" />
    <g className={`city-camera ${selected ? `camera-${selected}` : ""}`}>
      <g className="city-parallax">
        <g aria-hidden="true">
          <Box x={-30} y={-30} w={430} d={390} h={15} z={-19} colors={["#252c43","#1c2238","#31394d"]} />
          <Face vertices={[[-30,-30],[400,-30],[400,360],[-30,360]]} fill="#2b3348" />
          <Face vertices={[[174,-30],[223,-30],[223,360],[174,360]]} fill="#171f32" />
          <Face vertices={[[-30,130],[400,130],[400,180],[-30,180]]} fill="#171f32" />
          {[[0,0,164,120],[234,0,145,120],[0,191,164,143],[234,191,145,143]].map(([x,y,w,d])=><Box key={x+y} {...{x,y,w,d}} h={4} colors={["#727180","#474d63","#555c70"]} />)}
          <Line from={[-25,155,1]} to={[390,155,1]} stroke="#b8a379" strokeWidth="1.2" strokeDasharray="14 12" />
          <Line from={[199,-25,1]} to={[199,349,1]} stroke="#b8a379" strokeWidth="1.2" strokeDasharray="14 12" />
          {[0,1,2,3,4].map(i=><g key={i}><Face vertices={[[163,133+i*9,1],[175,133+i*9,1],[175,137+i*9,1],[163,137+i*9,1]]} fill="#a4a5b1" /><Face vertices={[[178+i*9,181,1],[182+i*9,181,1],[182+i*9,192,1],[178+i*9,192,1]]} fill="#a4a5b1" /></g>)}
          <Sign x={86} y={151} z={1} fill="#b0adc1" size={7}>YASSA ST</Sign>
          <Tree x={-10} y={20} /><Tree x={366} y={20} />
        </g>
        <Location {...common} id="housing" label="Explore NYC Housing Intelligence apartments">
          <Face className="city-footprint" vertices={[[7,6,5],[153,6,5],[153,115,5],[7,115,5]]} />
          <Building x={18} y={12} w={64} d={70} h={164} floors={6} columns={3} colors={["#71565e","#453e54","#856b75"]}>
            <Box x={29} y={23} w={23} d={26} z={167} h={12} colors={["#52566c","#33394c","#75788a"]} />
            <Line from={[74,18,169]} to={[74,18,198]} stroke="#9c96ae" strokeWidth="1.6" />
          </Building>
          <Building x={89} y={12} w={58} d={70} h={127} floors={4} columns={3} colors={["#73667c","#45425d","#9a8b9e"]}>
            <g stroke="#242b40" strokeWidth="2" fill="none">
              {[42,65,88,111].map(z=><g key={z}><Line from={[105,84,z]} to={[140,84,z]} /><Line from={[105,89,z]} to={[140,89,z]} /><Line from={[105,84,z]} to={[105,89,z]} /><Line from={[140,84,z]} to={[140,89,z]} /><Line from={[111,86,z]} to={[134,86,z-23]} /></g>)}
            </g>
            <Box x={108} y={30} w={22} d={22} z={129} h={9} />
            <WaterTank x={120} y={40} z={151} />
          </Building>
          <Box x={26} y={83} w={117} d={17} h={22} colors={["#474257","#34354c","#777083"]} />
          <Sign x={84} y={101} z={8} size={8}>HOUSING / DATA</Sign>
          <path className="city-data-flow" d={`M${point(30,105,8)} L${point(145,105,8)}`} stroke="#c7b2ff" strokeWidth="2" strokeDasharray="3 13" />
        </Location>
        <Location {...common} id="renter" label="Explore Renter Dispute Assistant civic hall">
          <Face className="city-footprint" vertices={[[239,0,5],[370,0,5],[370,117,5],[239,117,5]]} />
          <Building x={250} y={12} w={104} d={64} h={82} floors={2} columns={5} tint="#d5d2fb" colors={["#74788e","#4e566f","#9a9cae"]}>
            <Box x={262} y={77} w={80} d={12} h={10} colors={["#797b91","#535970","#b4adbd"]} />
            <Box x={267} y={77} w={70} d={16} h={5} colors={["#797b91","#535970","#b4adbd"]} />
            <Face vertices={[[267,77,13],[337,77,13],[337,77,70],[267,77,70]]} fill="#2b344e" />
            {[270,289,308,327].map(x=><g key={x}><Box x={x} y={77} w={7} d={7} h={54} z={13} colors={["#b5adbf","#7e8098","#ded1df"]} /><Box x={x-2} y={75} w={11} d={11} h={4} z={65} colors={["#c4bacc","#84869b","#d8cfdf"]} /></g>)}
            <Face vertices={[[262,88,72],[342,88,72],[302,88,100]]} fill="#b1a7c4" stroke="#ccc0d9" strokeWidth="2" />
            <Sign x={302} y={88.5} z={77} size={6} fill="#30354c">CIVIC HALL</Sign>
            <Line from={[340,20,87]} to={[340,20,130]} stroke="#c0b7d4" strokeWidth="2" />
            <Face className="city-flag" vertices={[[340,20,128],[360,20,123],[360,20,111],[340,20,116]]} fill="#b9a1ff" />
          </Building>
        </Location>
        <g aria-hidden="true"><Lamp x={157} y={113} /><Lamp x={237} y={113} />
          <g className="city-cab"><Box x={-15} y={140} w={29} d={13} h={9} z={3} colors={["#e6b35d","#aa7944","#f9cc74"]} /><Box x={-8} y={142} w={14} d={9} h={6} z={12} colors={["#8591ae","#4a5774","#efc875"]} /><Line from={[-12,153,4]} to={[-7,153,4]} stroke="#121b2d" strokeWidth="5" /><Line from={[6,153,4]} to={[11,153,4]} stroke="#121b2d" strokeWidth="5" /></g>
        </g>
        <Location {...common} id="watchmate" label="Explore WatchMate cinema">
          <Face className="city-footprint" vertices={[[0,195,5],[154,195,5],[154,327,5],[0,327,5]]} />
          <Building x={13} y={200} w={130} d={89} h={94} floors={2} columns={6} tint="#ffbcb7" colors={["#64526c","#39364f","#927991"]}>
            <Box x={28} y={217} w={94} d={8} h={39} z={95} colors={["#413e59","#353449","#827590"]} />
            <Face className="city-screen" vertices={[[34,225.5,101],[116,225.5,101],[116,225.5,128],[34,225.5,128]]} fill="url(#city-screen)" />
            <Sign x={75} y={226} z={109} size={11} fill="#29243e">WATCHMATE</Sign>
            <Face vertices={[[25,290,7],[127,290,7],[127,290,49],[25,290,49]]} fill="#24293f" />
            {[36,59,82,105].map(x=><g key={x}><Face vertices={[[x,291,7],[x+15,291,7],[x+15,291,42],[x,291,42]]} fill="#b494b7" /><Line from={[x+7,292,8]} to={[x+7,292,42]} stroke="#44415c" strokeWidth="2" /></g>)}
            <Box x={5} y={280} w={146} d={28} h={18} z={48} colors={["#d4a0a7","#91697f","#aa7e97"]} />
            <Face className="city-marquee" vertices={[[9,308.5,51],[147,308.5,51],[147,308.5,63],[9,308.5,63]]} fill="#ffe0ac" />
            <Sign x={78} y={309} z={53} size={7} fill="#624057">NOW SHOWING / WATCHMATE</Sign>
            {Array.from({length:15},(_,i)=><circle key={i} cx={point(11+i*9.5,309,66)[0]} cy={point(11+i*9.5,309,66)[1]} r="1.7" fill="#ffe2b5" />)}
            <Box x={17} y={243} w={12} d={12} z={97} h={12} />
            <Face vertices={[[16,290.5,24],[25,290.5,24],[25,290.5,43],[16,290.5,43]]} fill="#eabe8c" />
          </Building>
          <Sign x={78} y={326} z={5} size={8} fill="#c9bbd9">CINEMA</Sign>
        </Location>
        <Location {...common} id="dnr" label="Explore DNR Events recording studio">
          <Face className="city-footprint" vertices={[[238,198,5],[375,198,5],[375,329,5],[238,329,5]]} />
          <Building x={249} y={204} w={109} d={89} h={86} floors={2} columns={5} tint="#b7c6f1" colors={["#496278","#303f5b","#71869b"]}>
            <Box x={258} y={220} w={43} d={30} z={89} h={12} colors={["#4a536b","#303b52","#8290a6"]} />
            {[0,1,2,3].map(i=><Line key={i} from={[263,225+i*5,102]} to={[296,225+i*5,102]} stroke="#3c455e" strokeWidth="2" />)}
            <Face vertices={[[266,294,9],[340,294,9],[340,294,59],[266,294,59]]} fill="#202d46" />
            <Sign x={303} y={294.5} z={65} size={11} fill="#d6ccf9">DNR STUDIO</Sign>
            <Sign x={303} y={295} z={42} size={6} fill="#ffa0a9">● ON AIR</Sign>
            <g className="city-wave" stroke="#adbbf0" strokeWidth="2.5">{[8,17,11,24,16,29,12,19,7].map((height,i)=><Line key={i} from={[278+i*6,295,17]} to={[278+i*6,295,17+height]} style={{animationDelay:`${i*-.16}s`}} />)}</g>
            <Line from={[345,217,91]} to={[345,217,128]} stroke="#a0abc0" strokeWidth="2" />
            <Line from={[335,217,113]} to={[355,217,113]} stroke="#a0abc0" strokeWidth="2" />
            <circle cx={point(345,217,131)[0]} cy={point(345,217,131)[1]} r="3" fill="#f38eac" />
          </Building>
        </Location>
        <g aria-hidden="true">
          <Tree x={9} y={329} /><Tree x={373} y={310} /><Lamp x={153} y={313} /><Lamp x={237} y={321} />
          <Box x={320} y={310} w={37} d={7} h={8} colors={["#636d82","#343c54","#9b9aab"]} />
          <Line from={[323,312,8]} to={[323,312,22]} stroke="#8a92a5" strokeWidth="2" /><Line from={[354,312,8]} to={[354,312,22]} stroke="#8a92a5" strokeWidth="2" />
          <Sign x={339} y={313} z={13} size={6} fill="#f2e3be">SUBWAY</Sign>
          <Box x={323} y={313} w={31} d={12} h={1} colors={["#111b30","#111b30","#111b30"]} />
          <Box x={-15} y={266} w={7} d={18} h={4} colors={["#846d75","#554d63","#b29a92"]} />
          <Box x={371} y={235} w={6} d={13} h={11} colors={["#4b726f","#315450","#6b9490"]} />
          <Line from={[183,320,0]} to={[183,320,42]} stroke="#79839a" strokeWidth="2" />
          <Face vertices={[[173,320,33],[193,320,33],[193,320,41],[173,320,41]]} fill="#657b74" />
          <Sign x={183} y={320.5} z={35} size={4}>YASSA ST</Sign>
          <g className="city-train"><Box x={23} y={359} w={160} d={2} h={12} z={-15} colors={["#8290a8","#58687f","#bec2d0"]} />{Array.from({length:13},(_,i)=><Face key={i} vertices={[[28+i*12,361.5,-11],[35+i*12,361.5,-11],[35+i*12,361.5,-5],[28+i*12,361.5,-5]]} fill="#ffdab0" />)}</g>
        </g>
      </g>
    </g>
  </svg>;
}

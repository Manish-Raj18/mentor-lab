import React from 'react';
import "../css_files/roadmapbc.css";
const BcaRoadmap = () => {
  // Styles object mimicking the original CSS
  const styles = {
    bodyWrapper: {
      backgroundColor: '#d1ad3d',
      display: 'flex',
      justifyContent: 'center',
      alignitems: 'center',
      height: '100vh',
      margin: 0,
      fontFamily: "'Segoe UI', Arial, sans-serif",
    },
    roadmapCanvas: {
      backgroundColor: '#c9a334',
      width: '600px',
      height: '650px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '20px',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
    },
    mainHeading: {
      position: 'absolute',
      top: '25px',
      textAlign: 'center',
      color: '#ffffff',
      fontSize: '32px',
      fontWeight: '800',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '3px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    circleTrack: {
      position: 'relative',
      width: '320px',
      height: '320px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '50%',
      marginTop: '50px',
    },
    centerBox: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '150px',
      height: '150px',
      backgroundColor: '#ffeb3b',
      borderRadius: '12px',
      padding: '8px',
      boxSizing: 'border-box',
      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
      zIndex: 10,
    },
    centerCircle: {
      width: '100%',
      height: '100%',
      backgroundColor: '#1976d2',
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: 1.3,
      border: '2px dashed rgba(255, 255, 255, 0.5)',
    },
    node: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '30px',
      height: '30px',
      marginTop: '-15px',
      marginLeft: '-15px',
    },
    numberBadge: {
      width: '30px',
      height: '30px',
      backgroundColor: '#e0e0e0',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '12px',
      color: '#333',
      border: '2px solid #c9a334',
    },
    textBox: {
      position: 'absolute',
      whiteSpace: 'nowrap',
      backgroundColor: '#ebd185',
      padding: '4px 10px',
      borderRadius: '5px',
      fontSize: '12px',
      color: '#1a252f',
      fontWeight: 'bold',
      lineHeight: 1.3,
    },
    spanText: {
      fontSize: '11px',
      fontWeight: 'normal',
      display: 'block',
      color: '#4a5568',
    },
    // Directional Positions
    topText: { bottom: '38px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
    bottomText: { top: '38px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
    rightText: { left: '38px', top: '50%', transform: 'translateY(-50%)', textAlign: 'left' },
    leftText: { right: '38px', top: '50%', transform: 'translateY(-50%)', textAlign: 'right' },
    // Rotations
    n1: { transform: 'rotate(270deg) translate(160px) rotate(-270deg)' },
    n2: { transform: 'rotate(315deg) translate(160px) rotate(-315deg)' },
    n3: { transform: 'rotate(0deg)   translate(160px) rotate(0deg)' },
    n4: { transform: 'rotate(45deg)  translate(160px) rotate(-45deg)' },
    n5: { transform: 'rotate(90deg)  translate(160px) rotate(-90deg)' },
    n6: { transform: 'rotate(135deg) translate(160px) rotate(-135deg)' },
    n7: { transform: 'rotate(180deg) translate(160px) rotate(180deg)' },
    n8: { transform: 'rotate(225deg) translate(160px) rotate(-225deg)' },
  };

  return (
    <div style={styles.bodyWrapper}>
      <div style={styles.roadmapCanvas}>
        <h1 style={styles.mainHeading}>BCA Roadmap</h1>

        <div style={styles.circleTrack}>
          {/* Center Box */}
          <div style={styles.centerBox}>
            <div style={styles.centerCircle}>
              Core<br />Subjects<br />BCA
            </div>
          </div>

          {/* Node 1 */}
          <div style={{ ...styles.node, ...styles.n1 }}>
            <div style={styles.numberBadge}>01</div>
            <div style={{ ...styles.textBox, ...styles.topText }}>
              Programming Languages
              <span style={styles.spanText}>(C, C++, Java)</span>
            </div>
          </div>

          {/* Node 2 */}
          <div style={{ ...styles.node, ...styles.n2 }}>
            <div style={styles.numberBadge}>02</div>
            <div style={{ ...styles.textBox, ...styles.rightText }}>
              Data Structures<br />and Algorithms
            </div>
          </div>

          {/* Node 3 */}
          <div style={{ ...styles.node, ...styles.n3 }}>
            <div style={styles.numberBadge}>03</div>
            <div style={{ ...styles.textBox, ...styles.rightText }}>
              Database Management<br />Systems
            </div>
          </div>

          {/* Node 4 */}
          <div style={{ ...styles.node, ...styles.n4 }}>
            <div style={styles.numberBadge}>04</div>
            <div style={{ ...styles.textBox, ...styles.rightText }}>
              Operating Systems
            </div>
          </div>

          {/* Node 5 */}
          <div style={{ ...styles.node, ...styles.n5 }}>
            <div style={styles.numberBadge}>05</div>
            <div style={{ ...styles.textBox, ...styles.bottomText }}>
              Web Technologies
              <span style={styles.spanText}>(HTML, CSS, JavaScript)</span>
            </div>
          </div>

          {/* Node 6 */}
          <div style={{ ...styles.node, ...styles.n6 }}>
            <div style={styles.numberBadge}>06</div>
            <div style={{ ...styles.textBox, ...styles.leftText }}>
              Software Engineering
            </div>
          </div>

          {/* Node 7 */}
          <div style={{ ...styles.node, ...styles.n7 }}>
            <div style={styles.numberBadge}>07</div>
            <div style={{ ...styles.textBox, ...styles.leftText }}>
              Web Development
            </div>
          </div>

          {/* Node 8 */}
          <div style={{ ...styles.node, ...styles.n8 }}>
            <div style={styles.numberBadge}>08</div>
            <div style={{ ...styles.textBox, ...styles.leftText }}>
              Networking and<br />Computer Security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BcaRoadmap;
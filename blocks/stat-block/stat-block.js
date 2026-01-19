
export default function decorate(block) {
 console.log("Begin rendering Stat Block");
   const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'stat-block-container';

  const animatedElements = [];

  items.forEach((item) => {
    const stat = document.createElement('div');
    stat.className = 'stat-block-item';

    const valueDiv = item.children[0];
    const labelDiv = item.children[1];
    
  })
  console.log("After render stat block")
}

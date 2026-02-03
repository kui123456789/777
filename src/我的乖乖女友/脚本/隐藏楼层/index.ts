$(() => {
  console.info('[隐藏楼层脚本] 加载成功');

  const styleId = 'hide-old-floors-style';
  // 使用 CSS 隐藏所有非最后一个的消息楼层
  // #chat .mes 选择所有消息楼层
  // :not(:last-of-type) 排除最后一个楼层
  // !important 确保样式优先级最高，覆盖其他可能的 CSS
  const css = `
    #chat .mes:not(:last-of-type) {
      display: none !important;
    }
  `;

  // 先移除可能已存在的旧样式，避免重复
  $(`#${styleId}`).remove();

  // 创建新的 style 标签并添加到 head 中
  $('<style>')
    .attr('id', styleId)
    .text(css)
    .appendTo('head');

  // 监听脚本卸载事件，清理添加的样式
  $(window).on('pagehide', () => {
    $(`#${styleId}`).remove();
    console.info('[隐藏楼层脚本] 卸载成功');
  });
});

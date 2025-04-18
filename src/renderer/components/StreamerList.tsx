import React from 'react';
import { Streamer } from '../../common/types';

interface StreamerListProps {
  streamers: Streamer[];
  loading: boolean;
}

const StreamerList: React.FC<StreamerListProps> = ({ streamers, loading }) => {
  // 按照直播状态排序：在线的排在前面
  const sortedStreamers = [...streamers].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return 0;
  });

  if (loading) {
    return <div className="loading-container">加载中...</div>;
  }

  if (streamers.length === 0) {
    return <div className="empty-list">暂无关注主播数据</div>;
  }

  const handleOpenStream = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="streamer-list">
      {sortedStreamers.map(streamer => (
        <div 
          key={`${streamer.platform}-${streamer.id}`} 
          className={`streamer-card ${streamer.isLive ? 'live' : 'offline'}`}
          onClick={() => streamer.isLive && handleOpenStream(streamer.roomUrl)}
        >
          <div className="streamer-avatar">
            <img src={streamer.avatar} alt={streamer.name} />
            {streamer.isLive && <span className="live-badge">LIVE</span>}
          </div>
          
          <div className="streamer-info">
            <h3 className="streamer-name">{streamer.name}</h3>
            
            {streamer.isLive ? (
              <>
                <div className="stream-title">{streamer.title || '无标题'}</div>
                <div className="stream-meta">
                  <span className="category">{streamer.category || '未知分类'}</span>
                  <span className="viewer-count">
                    {streamer.viewerCount ? `${streamer.viewerCount.toLocaleString()} 观众` : ''}
                  </span>
                </div>
              </>
            ) : (
              <div className="offline-message">未开播</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StreamerList;
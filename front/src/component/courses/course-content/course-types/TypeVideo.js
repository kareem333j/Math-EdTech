import { useEffect, useRef, useState, useMemo } from "react";
import axiosInstance from "../../../../Axios";
import LogoImg from '../../../../assets/images/logos/logo_white.png';
import LogoImgDark from '../../../../assets/images/logos/logo_dark.png';
import useLocalStorage from "use-local-storage";
import { LoveBtn } from "../../../inherit/LoveBtn";
import YouTube from "react-youtube";

function TypeVideo(props) {
  const videoData = props.videoData;
  const [likes, setLikes] = useState(0);
  const [userLike, setUserLike] = useState(false);
  const [storage] = useLocalStorage('isDark');
  const videoEmbed = useRef();

  useEffect(() => {
    setUserLike(false);
    setLikes(0);
    getLikes();
    console.log(videoData);
  }, [videoData.id]);

  const getLikes = () => {
    axiosInstance
      .get(`quizzes/get/video/likes/${videoData.id}`)
      .then((response) => {
        setUserLike(response.data.like === true);
        setLikes(response.data.likes);
      })
      .catch((err) => {
        setLikes(videoData.likes);
      });
  };

  const handleLikes = () => {
    axiosInstance
      .post('quizzes/update/video/likes', {
        id: videoData.id,
        like: !userLike,
      })
      .then(() => {
        getLikes();
      })
      .catch((err) => console.log(err));
  };

  const isYouTubeEmbed = (embedCode) => {
    return embedCode.includes("youtube.com") || embedCode.includes("youtu.be");
  };

  const extractYouTubeVideoId = (embedCode) => {
    const match = embedCode.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const extractDriveVideoSrc = (embedCode) => {
    const match = embedCode.match(/src="([^"]+)"/);
    console.log(match);
    return match ? match[1] : null;
  };

  const VideoPlayer = useMemo(() => {
    const DriveVideoEmbed = ({ embedCode }) => {
      const src = extractDriveVideoSrc(embedCode);

      // استخراج ID بتاع الفيديو من الدرايف
      const extractDriveFileId = (src) => {
        try {
          const url = new URL(src);
          if (url.searchParams.get("id")) {
            return url.searchParams.get("id");
          }
          const match = src.match(/\/file\/d\/([^/]+)/);
          if (match) return match[1];
          const ucMatch = src.match(/uc\?id=([^&]+)/);
          if (ucMatch) return ucMatch[1];
          return null;
        } catch {
          return null;
        }
      };

      const fileId = src ? extractDriveFileId(src) : null;
      const drivePreviewLink = fileId
        ? `https://drive.google.com/file/d/${fileId}/preview`
        : src;

      return (
        <div className="video-container" ref={videoEmbed}>
          {drivePreviewLink && (
            <iframe
              key={`video-${videoData.id}`}
              src={drivePreviewLink}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              frameBorder="0"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Google Drive Video"
            />
          )}
        </div>
      );
    };


    const YouTubeVideoEmbed = ({ embedCode }) => {
      const videoId = extractYouTubeVideoId(embedCode);

      const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
      };

      return (
        <div className="video-container" ref={videoEmbed}>
          {videoId && (
            <YouTube
              videoId={videoId}
              opts={opts}
              className="youtube-player"
              iframeClassName="youtube-iframe"
            />
          )}
        </div>
      );
    };

    // التحقق من نوع الفيديو وإرجاع المشغل المناسب
    return isYouTubeEmbed(videoData.video_embed) ? (
      <YouTubeVideoEmbed embedCode={videoData.video_embed} />
    ) : (
      <DriveVideoEmbed embedCode={videoData.video_embed} />
    );
  }, [videoData.video_embed, videoData.id]);

  return (
    <div className="player_wrapper p-0 d-flex justify-content-center align-items-center flex-column">
      <div className="player-div-1">
        <img className="hide-btn p-2" src={storage ? LogoImgDark : LogoImg} alt="logo" />
        {VideoPlayer}
        <div className="player-div-2"></div>
      </div>
      <h3 className="title w-100 d-flex justify-content-start align-items-center">{videoData.title}</h3>
      <div className="video-options w-100">
        <div className="d-flex align-items-center likes">
          <LoveBtn handleLikes={handleLikes} userLike={userLike} />
          <div className="d-flex gap-2" style={{ fontSize: '1.1em', color: 'var(--color-default2)' }}>
            <span>{likes}</span>
            <span>إعجاب</span>
          </div>
        </div>
      </div>
      <div className="video-description-div w-100 d-flex flex-column" dir="rtl">
        <span className="desc-title mb-2">الوصف :</span>
        <span style={{ whiteSpace: "pre-line" }} className="description">{videoData.description}</span>
      </div>
    </div>
  );
}

export default TypeVideo;


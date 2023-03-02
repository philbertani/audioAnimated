import * as React from "react";
import { Card, Box, CardContent } from "@mui/material";

import AudioContextPlus from "../../audio";
import Metronome from "../../metronome";
import { useDispatch, useSelector } from "react-redux";

import FileCard from "./FileCard";
import Player from "./Player";

import convertChunksToWavBlob from "../../recorder";

import { addFileAsync, writeFileAsync } from "../../features";

import {
  setSectionToPlay,
  setFinished,
  setTryToStart,
  setPlayAllActuallyStarted,
  setPlayAllStarted,
} from "../../features/projects/playAllSlice";

export default function MultiFilePlayer({
  title,
  files,
  sectionNumber,
  inSection,
  setGPUconfig,
  renderGraphics,
  record,
  userId,
  projectId,
  setMsgKey,
  smallPlayer,
  setRecorded,
  newFileName,
  playAllCanvasRef,
  acRefs,
  setPlayAllGPUconfig,
  useMetronome,
  metronomeTempo,
  final,
}) {
  const dispatch = useDispatch();

  const { recordLatencyAdjustment } = useSelector(
    (state) => state.singleProject
  );

  const audioRawFiles = useSelector(
    (state) => state.singleProject.audioRawFiles
  );

  const availableFiles = useSelector(
    (state) => state.singleProject.availableFiles
  );

  const {
    sectionToPlay,
    tryToStart,
    finished,
    playAllPlayPause,
    playAllActuallyStarted,
  } = useSelector((state) => state.playAll);

  const { sections } = useSelector((state) => state.singleProject);

  const [disabled, setDisabled] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [timeSnapshot, setTimeSnapshot] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(0);
  const [ended, setEnded] = React.useState(0);
  const [restart, setRestart] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [loop, setLoop] = React.useState(false);
  const [saveRecording, setSaveRecording] = React.useState(false);

  const recordStreamRef = React.useRef();
  const metrnomeRef = React.useRef();

  const recordingMessages = React.useRef();
  const sourceForMicophone = React.useRef();

  const acPlusRef = React.useRef();
  React.useEffect(() => {
    if (!acPlusRef.current) {
      acPlusRef.current = new AudioContextPlus();
    }
  }, []);
  if (record && !recordStreamRef.current) {
    getRecordingPermission();
  }

  function getRecordingPermission() {
    if (navigator.mediaDevices.getUserMedia) {

      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          googEchoCancellation: false,
          googAutoGainControl: false,
          googExperimentalAutoGainControl: false,
          googNoiseSuppression: false,
          googExperimentalNoiseSuppression: false,
          googHighpassFilter: false,
          googTypingNoiseDetection: false,
          googBeamforming: false,
          googArrayGeometry: false,
          googAudioMirroring: false,
          googNoiseReduction: false,
          mozNoiseSuppression: false,
          mozAutoGainControl: false,
        },
      };

      let onSuccess = function (stream) {
        recordStreamRef.current = stream;
      };

      let onError = function (err) {
        console.log("The following error occured: " + err);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  const context = React.useRef();
  if (!context.current) {
    context.current = new AudioContext();
  }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const startRecording = async () => {
    let seconds = 0;
    const maxWait = 10;
    while (!recordStreamRef.current) {
      await delay(1000);
      seconds++;
      if (seconds === maxWait) break;
    }

    sourceForMicophone.current = context.current.createMediaStreamSource(
      recordStreamRef.current
    );

    // NEW A: Loading the worklet processor
    await context.current.audioWorklet.addModule("/recorder.worklet.js");

    // Create the recorder worklet
    const recorder = new AudioWorkletNode(context.current, "recorder.worklet");

    context.current.resume();

    sourceForMicophone.current
      .connect(recorder)
      .connect(context.current.destination);

    if (!recordingMessages.current) recordingMessages.current = [];
    recorder.port.onmessage = (e) => {
      recordingMessages.current = recordingMessages.current.concat([e.data]);
    };
  };
  React.useEffect(() => {
    const fnSaveRecording = async () => {
      const file = convertChunksToWavBlob(
        context.current,
        recordingMessages.current,
        recordLatencyAdjustment
      );
      const filePath = `${newFileName}.wav`;
      const data = {
        name: newFileName,
        filePath,
        type: "wav",
        userId: userId,
        projectId: projectId,
      };
      await dispatch(writeFileAsync({ projectId, filePath, file }));
      await dispatch(addFileAsync(data));
      setRecorded(true);
    };
    if (
      saveRecording &&
      (recordingMessages.current.length > 0) &
        (newFileName && newFileName.length > 0)
    ) {
      fnSaveRecording();
    }
  }, [
    dispatch,
    recordLatencyAdjustment,
    recordingMessages,
    saveRecording,
    userId,
    projectId,
    newFileName,
    setRecorded,
  ]);

  if (
    acPlusRef &&
    acPlusRef.current &&
    acRefs &&
    acRefs.current &&
    !acRefs.current[sectionNumber]
  ) {
    acRefs.current[sectionNumber] = acPlusRef.current;
  }

  React.useEffect(() => {
    if (useMetronome && metronomeTempo && !metrnomeRef.current) {
      metrnomeRef.current = new Metronome(metronomeTempo);
    }
  }, [useMetronome, metronomeTempo]);

  // you dont need to wait for audio buffers if you have no files
  // and you want to record
  React.useEffect(() => {
    const wait = async () => {
      if ((Object.keys(availableFiles).length === 0) & record) {
        let seconds = 0;
        const maxWait = 10;
        while (!recordStreamRef.current) {
          await delay(1000);
          seconds++;
          if (seconds === maxWait) break;
        }
        setDisabled(false);
      }
    };
    wait();
  }, [record, availableFiles]);

  React.useEffect(() => {
    const createBuffers = async () => {
      // wait for raw audio to load before executing
      if (
        (audioRawFiles && !Object.keys(audioRawFiles).length) ||
        typeof files === "undefined"
      )
        return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const raw = audioRawFiles[file.name];

        const audio = undefined;
        await acPlusRef.current.createAudioBuffers(raw, audio, fileName);
      }

      if (record) {
        let seconds = 0;
        const maxWait = 10;
        while (!recordStreamRef.current) {
          await delay(1000);
          seconds++;
          if (seconds === maxWait) break;
        }
      }
      setDisabled(false);
    };
    createBuffers();
  }, [record, files, audioRawFiles]);

  React.useEffect(() => {
    const getDuration = () => {
      if (!disabled) {
        const buffers = Object.values(acPlusRef.current.audioBuffers);
        const durations = buffers.map((x) => x.duration);
        if (durations.length) {
          const max = Math.max(...durations);
          setDuration(max);
        }
      }
    };
    getDuration();
  }, [disabled]);

  const [sectionPlayed, setSectionPlayed] = React.useState(-1);

  const recordStartStop = async () => {
    if (isRecording) {
      setMsgKey("stopped");
      setIsRecording(false);
      setSaveRecording(true);
      sourceForMicophone.current.disconnect();
      if (metrnomeRef.current) metrnomeRef.current.stop();
    } else {
      await startRecording();
      setMsgKey("recording");
      setIsRecording(true);
      if (metrnomeRef.current) metrnomeRef.current.start();
    }
  };

  const playSection = React.useCallback(async () => {
    if (ended) {
      setTimeSnapshot(acPlusRef.current.AC.currentTime);
      setEnded(false);
    }
    const onEndCallback = () => {
      setEnded(true);
    };
    acPlusRef.current.loadSources(files.map((x) => x.name));
    await acPlusRef.current.playNSongs(
      files.map((x) => x.name),
      onEndCallback
    );

    setIsPlaying(acPlusRef.current.isPlaying);
  }, [ended, files]);

  React.useEffect(() => {
    if (ended) {
      setTimeSnapshot(acPlusRef.current.AC.currentTime);
      setCurrentTime(0);
      clearInterval(intervalId);
      setIntervalId(0);
      setIsPlaying(false);

      acPlusRef.current.started = false;
      acPlusRef.current.isPlaying = false;

      if (restart | loop) {
        playSection();
        setRestart(false);
      }
    }
  }, [intervalId, ended, playSection, restart, loop]);

  React.useEffect(() => {
    if (setMsgKey & !record) {
      if (isPlaying) setMsgKey("playing");
      else setMsgKey("stopped");
    }
  }, [record, isPlaying, setMsgKey]);

  // Set the current time to display time passed on playback
  React.useEffect(() => {
    const playbackStarted = isPlaying;
    if (!playbackStarted) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
    if (playbackStarted & (intervalId === 0)) {
      const id = setInterval(function () {
        if (acPlusRef.current) {
          const time = acPlusRef.current.AC.currentTime;
          const position = time - timeSnapshot;
          setCurrentTime(position);
        }
      }, 1000);
      setIntervalId(id);
    }
  }, [isPlaying, intervalId, timeSnapshot]);

  const restartOnClick = () => {
    if (!isPlaying) {
      playSection();
      return;
    }
    acPlusRef.current.sources.forEach((source) => {
      source.stop();
      source.disconnect();
    });
    setRestart(true);
  };

  const toggleLoop = () => {
    setLoop(!loop);
  };

  const changeVolume = (value, fileName) => {
    if (!acPlusRef.current.started) {
      acPlusRef.current.loadSources(files.map((x) => x.name));
    }
    const fileIndex = files.map((x) => x.name === fileName).indexOf(true);
    acPlusRef.current.setGain(value, fileIndex);
  };

  React.useEffect(() => {
    if (renderGraphics) {
      //acRefs.current[sectionNumber] = acPlusRef.current
      setGPUconfig({
        isPlaying,
        acPlusRef: acPlusRef.current,
        sectionNumber,
        graphicsFn: sectionNumber - 1,
        //acRefs:acRefs
      });
    }
  }, [renderGraphics, isPlaying, sectionNumber, setGPUconfig, acRefs]);

  const playAllCanvasCreatedRef = React.useRef(false);
  const finishedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  if (finished && playAllCanvasCreatedRef.current) {
    playAllCanvasCreatedRef.current = false;
    //only happens for 1st section
  }

  React.useEffect(() => {
    if (finished && finishedRef.current) {
      finishedRef.current = false;
      dispatch(setFinished(false));
    }
  }, [finished, sectionNumber, dispatch]);

  React.useEffect(() => {
    if (playAllActuallyStarted) {
      const sectionNum =
        (sections &&
          sections[sectionToPlay] &&
          sections[sectionToPlay].sectionNumber) ??
        -10;
      if (sectionNum === sectionNumber) {
        if (!playAllPlayPause) {
          if (acPlusRef.current.AC.state === "running")
            acPlusRef.current.AC.suspend().then((val) => {
              console.log("suspended", sectionNumber);
            });
        } else if (playAllPlayPause) {
          if ("suspended interrupted".includes(acPlusRef.current.AC.state))
            acPlusRef.current.AC.resume().then((val) => {
              console.log("resumed", sectionNumber);
            });
        }
      }
    }
  }, [
    playAllActuallyStarted,
    isPlaying,
    playAllPlayPause,
    sectionNumber,
    sectionToPlay,
    sections,
    ended,
    playSection,
  ]);

  React.useEffect(() => {
    if (playAllActuallyStarted) {
      const sectionNum =
        (sections &&
          sections[sectionToPlay] &&
          sections[sectionToPlay].sectionNumber) ??
        -10;
      if (sectionNum === sectionNumber) {
        if (!playAllPlayPause) {
          if (acPlusRef.current.AC.state === "running")
            acPlusRef.current.AC.suspend().then((val) => {
              console.log("suspended", sectionNumber);
            });
        } else if (playAllPlayPause) {
          if ("suspended interrupted".includes(acPlusRef.current.AC.state))
            acPlusRef.current.AC.resume().then((val) => {
              console.log("resumed", sectionNumber);
            });
        }
      }
    }
  }, [
    playAllActuallyStarted,
    isPlaying,
    playAllPlayPause,
    sectionNumber,
    sectionToPlay,
    sections,
    ended,
    playSection,
  ]);

  React.useEffect(() => {
    if (finished) {
      console.log("in MultiFilePlayer finished", sectionNumber);
      dispatch(setPlayAllStarted(false));
      dispatch(setPlayAllActuallyStarted(false));

      if (isPlaying) {
        acPlusRef.current.sources.forEach((source) => {
          source.stop();
          source.disconnect();
        });
      }
      setIsPlaying(false);
      setEnded(true);

      acPlusRef.current.AC.suspend();
    }
  }, [finished, sectionNumber, dispatch, isPlaying]);

  React.useEffect(() => {
    //loop  through  the sections array in index order
    try {
      if (tryToStart && !finishedRef.current) {
        const sectionNum = sections[sectionToPlay].sectionNumber;

        if (
          sectionToPlay === 0 &&
          sectionNumber === sectionNum &&
          !playAllCanvasCreatedRef.current
        ) {
          playAllCanvasRef.current.classList.remove("hidden");
          playAllCanvasRef.current.style.width = final ? "100vw" : "84vw";
          playAllCanvasRef.current.style.height = final ? "75vh" : "82vh";
          playAllCanvasRef.current.style.transform = "translate(0,-5vh)";
          playAllCanvasCreatedRef.current = true;
          finishedRef.current = false;
          setPlayAllGPUconfig({
            isPlaying: true,
            acPlusRef: acPlusRef.current,
            sectionNumber,
            graphicsFn: 0,
            acRefs: acRefs,
          });
        }

        //I found that the only consistent way to get playAll moving was to track
        //these 4 states (sectionNum,sectionNumber,sectionPlayed,isPlaying)
        //and check for certain conditions, keying it off of
        //onEndCallback was a disaster
        if (
          !isPlaying &
          (sectionNum === sectionNumber) &
          (sectionPlayed === -1) &
          !startedRef.current
        ) {
          playSection();
          if (sectionToPlay === 0) {
            dispatch(setPlayAllActuallyStarted(true));
          }
          setSectionPlayed(sectionNum);
        } else if (
          !isPlaying &
          (sectionNum === sectionNumber) &
          (sectionPlayed === sectionNumber)
        ) {
          const nextSection = sectionToPlay + 1;
          setSectionPlayed(-1);
          finishedRef.current = true;
          if (nextSection < sections.length) {
            dispatch(setSectionToPlay(nextSection));
            setPlayAllGPUconfig({
              isPlaying: true,
              acPlusRef: acPlusRef.current,
              sectionNumber: sections[nextSection].sectionNumber,
              graphicsFn: 0,
              acRefs: acRefs,
            });
          } else if (!finished) {
            dispatch(setFinished(true));
            dispatch(setTryToStart(false));
            dispatch(setPlayAllActuallyStarted(false));
          }
        }
      }
    } catch (err) {}
  }, [
    playSection,
    sectionToPlay,
    ended,
    sectionPlayed,
    sectionNumber,
    sections,
    dispatch,
    isPlaying,
    tryToStart,
    playAllCanvasRef,
    acRefs,
    setPlayAllGPUconfig,
    finished,
    final,
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      <Player
        title={title}
        isPlaying={isPlaying}
        currentTime={currentTime}
        playOnClick={playSection}
        recordStartStop={recordStartStop}
        restartOnClick={restartOnClick}
        disabled={disabled || (playAllActuallyStarted && !finished)}
        duration={duration}
        loop={loop}
        toggleLoop={toggleLoop}
        record={record}
        isRecording={isRecording}
        availableFiles={availableFiles}
        files={files}
      />
      {smallPlayer === true ? (
        <Card>
          <CardContent>
            <Files
              files={files}
              changeVolume={changeVolume}
              inSection={inSection}
              smallPlayer={smallPlayer}
            />
          </CardContent>
        </Card>
      ) : (
        <Files
          files={files}
          changeVolume={changeVolume}
          inSection={inSection}
        />
      )}
    </Box>
  );
}

function Files({ files, changeVolume, inSection, smallPlayer }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1vh" }}>
      {files && files.length
        ? files.map((file) => (
            <FileCard
              key={file.name}
              file={file}
              changeVolume={changeVolume}
              inSection={inSection}
              smallPlayer={smallPlayer}
            />
          ))
        : null}
    </Box>
  );
}

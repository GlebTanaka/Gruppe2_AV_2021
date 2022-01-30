# Music Player
> Ein Projekt um simple Musik zu mixen, zu filtern, zu visualisieren und herunterzuladen.

GitHub-Link: https://github.com/GlebTanaka/Gruppe2_AV_2021

## Inhaltsverzeichnis
* [Beschreibung](#beschreibung)
* [Features](#features)
* [Installation](#installation)
* [Technologien](#technologien)
* [Autoren](#autoren)

## Beschreibung

Die Anwendung besteht aus zwei Musik-Playern die unabhängig voneinander konfiguriert werden können. Das Ergibnis der aktuell abgespielten Musik wird dabei visualisiert und kann manipuliert und heruntergeladen werden.

## Features

### 1 Musik-Player
![Musik-Player](./readme-files/music-player.png)

Jeder Musik-Player besteht aus `1` einem [Menü](#11-menu), `2` einem [Song Menü](#12-song-menu) und `3` einer Anzeige für den ausgewählten [Menü](#11-menu)-Unterpunkt.

#### 1.1 Menü
![Menü](./readme-files/menu.png)

Beide Musik-Player haben ein Menü um einzelne Features aufzurufen. `1` ist beim Start ausgewählt und zeigt den [Song](#111-song). `2` führt zu den [Filtern](#112-filter). `3` ermöglicht die [Einstellungen](#113-einstellungen) und `4` führt zur [Songauswahl](#114-songauswahl).

#### 1.1.1 Song

Song zeigt ein **Bild** zum aktuellen Song an sowie den dazu gehörigen Song **Titel**.

#### 1.1.2 Filter
![Filter](./readme-files/filter.png)

Die Filter lassen sich alle über Slider verwenden. Das Bewegen nach **links verringert** während das Bewegen nach **rechts verstärkt**. Der Slider unter **Volume** verändert die **Lautstärke** des jewiligen Songs. **Bass** verändert die **tiefen Frequenzen**, **Mid** die **mittleren Frequenzen** und **Treble** die **hohen Frequenzen** **?**.

#### 1.1.3 Einstellungen
![Einstellungen](./readme-files/einstellungen.png)

Über ein Textfeld **initial** kann die Geschwindigkeit des Songs in Beats pro Sekunde eingegeben werden und über das nächste Textfeld **new** dann verändert werden. Die resultierende Abspielrate des Songs wird dabei aus diesen zwei Werten errechnet.
Eine Checkbox **preserve pitch** kann ausgewählt werden um bei Änderung der Geschwindigkeit den Pitch nicht zu verändern. Diese Einstellung wird bei Song-Downloads nicht berücksichtigt.

#### 1.1.4 Songauswahl
![Songauswahl](./readme-files/songauswahl.png)

Durch Anklicken der Checkbox-Elemente ist es möglich nur bestimmte Songs auszuwählen. In jeder Zeile befindet sich dabei zunächst der Titel von dem Song und dahinter die Checkbox. Wenn in der Checckbox ein Häckchen gesetzt ist wird der Song dabei abgespielt, andernfalls nicht.

### 1.2 Song-Menü
![Song Menu](./readme-files/song-menu.png)

Über dem [Menü](#11-menu) befindet sich noch ein Menü um das Abspielen von dem Song zu steuern. `1` ist zum Starten und Stoppen vom Lied. `2` und `3` um zwischen den einzelnen Liedern zu wechseln. `2` wechselt dabei zum vorherigen Lied und `3` zum nächsten. Unter diesen Knöpfen befindet sich noch ein Slider `4` welcher anzeigt wie weit das aktuelle Lied schon abgespielt ist. Außerdem kann auch an eine Stelle auf dem Silder geklickt werden um an diese Stelle im Song zu springen.

### 2 Master-Controller / Visualizer
![Master-Controller](./readme-files/master-controller.png)

Der Master-Controller besteht aus einem `1` [Visulizer](#22-visulizer), `2` aus einem [Silder](#23-silder) und `3` aus einem [Menü](#21-visulizer-menu).

#### 2.1 Visualizer-Menü
![Visualizer-Menü](./readme-files/visualizer-menu.png)

Das Visualizer-Menü besteht aus 4 Knöpfen. `1` ermöglicht es, wenn nur einer der beiden [Player](#1-music-player) spielt zwischen diesen zu Wechseln. `2` ermöglicht es beide [Musik-Player](#1-music-player) gleichzeitig zu starten und zu stoppen. `3` ändert die Anzeigeart im [Visulizer](#22-visulizer), wenn der Kreis sich links befindet ist die Darstellung mit Balken ausgewählt, amsonsten als Sinus-Schwingung. `4` erlauabt es beide Songs gemischt als .wav-Datei herunterzuladen.

#### 2.2 Visualizer
![Schwingung](./readme-files/schwingung.png)
![Balken](./readme-files/balken.png)

Der Visualizer stellt die abgespielten Frequenzen je nach Auswahl im [Menü](#21-visualizer-menu) dar.

#### 2.3 Silder

Der Silder ermöglicht es die **Lautstärke** im **Verhältnis** zu den beiden [Musik-Playern](#1-music-player) anzupassen und somit zu mischen. Wenn der Slider ganz links ist wird der Song aus dem linken [Player](#1-music-player) zu 100% abgespielt und der Song aus dem rechten [Player](#1-music-player) zu 0%. Wenn der Slider ganz rechts ist wird simultan der Song aus dem rechten [Player](#1-music-player) zu 100% abgespielt. Mittig ist es 50/50. Dementspechend kann eine belibige prozentuale Einstellung getätigt werden.

## Installation

```
cd ./Gruppe2_AV_2021
npm install
npm start
```

## Technologienen

- [JavaScript](https://developer.mozilla.org/de/docs/Web/JavaScript)
- [HTML](https://developer.mozilla.org/de/docs/Web/HTML)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## Autoren
- Gleb Tanaka 561408
- Linda Fleischmann 573874
- Eduard Weber 566430

## Quellen

https://github.com/bradtraversy/vanillawebprojects/tree/master/music-player  
https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css  
https://www.russellgood.com/how-to-convert-audiobuffer-to-audio-file  
https://github.com/mdn/voice-change-o-matic/blob/gh-pages/scripts/app.js#L128-L205

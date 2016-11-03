#!/bin/bash
uuid=$(uuidgen)
filename=$TMPDIR/$uuid.png

convert -background none \
  -fill white \
  -font RobotoB \
  -pointsize 72 \
  -size 904x \
  caption:"$2" $filename

convert images/icon/social_template.jpg \
  -page +142+230 $filename \
  -layers flatten \
  images/post-social/$1.jpg

rm $filename
#!/bin/sh
# generated with CMTools 0.0.3 fe85f97

#
# Set the package name and version to install
#
PACKAGE="BlogIt"
VERSION="0.0.3"
GIT_GROUP="rsdoiel"
RELEASE="https://github.com/$GIT_GROUP/$PACKAGE/releases/tag/v$VERSION"
if [ "$PKG_VERSION" != "" ]; then
   VERSION="${PKG_VERSION}"
   echo "${PKG_VERSION} used for version v${VERSION}"
fi

#
# Get the name of this script.
#
INSTALLER="$(basename "$0")"

#
# Figure out what the zip file is named
#
OS_NAME="$(uname)"
MACHINE="$(uname -m)"
case "$OS_NAME" in
   Darwin)
   OS_NAME="macOS"
   ;;
   GNU/Linux)
   OS_NAME="Linux"
   ;;
esac

if [ "$1" != "" ]; then
   VERSION="$1"
   echo "Version set to v${VERSION}"
fi

ZIPFILE="$PACKAGE-v$VERSION-$OS_NAME-$MACHINE.zip"

#
# Check to see if this zip file has been downloaded.
#
DOWNLOAD_URL="https://github.com/$GIT_GROUP/$PACKAGE/releases/download/v$VERSION/$ZIPFILE"
if ! curl -L -o "$HOME/Downloads/$ZIPFILE" "$DOWNLOAD_URL"; then
	echo "Curl failed to get $DOWNLOAD_URL"
fi
cat<<EOT

  Retrieved $DOWNLOAD_URL
  Saved as $HOME/Downloads/$ZIPFILE

EOT

if [ ! -d "$HOME/Downloads" ]; then
	mkdir -p "$HOME/Downloads"
fi
if [ ! -f "$HOME/Downloads/$ZIPFILE" ]; then
	cat<<EOT

  To install $PACKAGE you need to download

    $ZIPFILE

  from

    $RELEASE

  You can do that with your web browser. After
  that you should be able to re-run $INSTALLER

EOT
	exit 1
fi

START="$(pwd)"
mkdir -p "$HOME/.$PACKAGE/installer"
cd "$HOME/.$PACKAGE/installer" || exit 1
unzip "$HOME/Downloads/$ZIPFILE" "bin/*" "man/*"

#
# Copy the application into place
#
mkdir -p "$HOME/bin"
EXPLAIN_OS_POLICY="yes"
find bin -type f >.binfiles.tmp
while read -r APP; do
	V=$("./$APP" --version)
	if [ "$V" = ""  ]; then
		EXPLAIN_OS_POLICY="yes"
	fi
	mv "$APP" "$HOME/bin/"
done <.binfiles.tmp
rm .binfiles.tmp

#
# Make sure $HOME/bin is in the path
#
case :$PATH: in
	*:$HOME/bin:*)
	;;
	*)
	# shellcheck disable=SC2016
	echo 'export PATH="$HOME/bin:$PATH"' >>"$HOME/.bashrc"
	# shellcheck disable=SC2016
	echo 'export PATH="$HOME/bin:$PATH"' >>"$HOME/.zshrc"
    ;;
esac

# shellcheck disable=SC2031
if [ "$EXPLAIN_OS_POLICY" = "no" ]; then
	cat <<EOT

  You need to take additional steps to complete installation.

  Your operating system security policies needs to "allow"
  running programs from $PACKAGE.

  Example: on macOS you can type open the programs in finder.

      open $HOME/bin

  Find the program(s) and right click on the program(s)
  installed to enable them to run.

  More information about security policies see INSTALL_NOTES_macOS.md

EOT

fi

#
# Copy the manual pages into place
#
EXPLAIN_MAN_PATH="no"
for SECTION in 1 2 3 4 5 6 7; do
    if [ -d "man/man${SECTION}" ]; then
        EXPLAIN_MAN_PATH="yes"
        mkdir -p "$HOME/man/man${SECTION}"
        find "man/man${SECTION}" -type f | while read -r MAN; do
            cp -v "$MAN" "$HOME/man/man${SECTION}/"
        done
    fi
done

if [ "$EXPLAIN_MAN_PATH" = "yes" ]; then
  cat <<EOT
  The man pages have been installed at '$HOME/man'. You
  need to have that location in your MANPATH for man to
  find the pages. E.g. For the Bash shell add the
  following to your following to your '$HOME/.bashrc' file.

      export MANPATH="$HOME/man:$MANPATH"

EOT

fi

rm -fR "$HOME/.$PACKAGE/installer"
cd "$START" || exit 1


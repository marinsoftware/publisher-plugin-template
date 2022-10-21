#!/bin/bash
# chkconfig: 2345 98 02

NAME=${NAME:-"nest-swagger-node"}
USER_NAME=${USER_NAME:-"marin"}
GROUP_NAME=${USER_NAME}

# /etc/sysconfig/marin/${SERVICE_NAME} is the new overrides file. try that first
# for things such as MARIN_ENCRYPTION_KEY, MARIN_ENV
if [ -f /etc/sysconfig/marin/${SERVICE_NAME} ]; then
    . /etc/sysconfig/marin/${SERVICE_NAME}
fi

# you can relocate the install by setting the SERVICE_HOME, otherwise we try to automagically determine the location
if [ "${SERVICE_HOME}" == "" ]; then
    SOURCE="${BASH_SOURCE[0]}"
    while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
      DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
      SOURCE="$(readlink "$SOURCE")"
      [[ ${SOURCE} != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
    done
    SERVICE_HOME="$( cd -P "$( dirname "$SOURCE" )" && pwd )/.."
fi

# config and log directories
LOG_DIR=${LOG_DIR:-"${SERVICE_HOME}/logs"}
VAR_LOG_DIR=${VAR_LOG_DIR:-"/var/log/marin/${NAME}"}
MARINPUBLISHERGATETWAYPLUGINSSERVICESTART_LOGFILE="${LOG_DIR}/nest-swagger-node-stdout.log"
# create either a logs dir or logs symlink the first time we run
if [ ! -e "${LOG_DIR}" ]; then
    if [ -e "${VAR_LOG_DIR}" ]; then
        echo "Creating symlink from ${LOG_DIR} to ${VAR_LOG_DIR}"
        ln -s "${VAR_LOG_DIR}" "${LOG_DIR}"
    else
        echo "Creating log dir ${LOG_DIR}"
        mkdir "${LOG_DIR}"
    fi
fi

chown -R ${USER_NAME}:${GROUP_NAME} ${SERVICE_HOME}

CONFIG_DIR=${CONFIG_DIR:-"${SERVICE_HOME}/conf"}
CONFIG_FILENAME="config.yaml"
# Check if config dir selected exists
if [ -z "${CONFIG_DIR}" -o ! -e "${CONFIG_DIR}" ]; then
    echo "ERROR: Config Dir ${CONFIG_DIR} NOT FOUND!!"
    exit 3
fi

# Verify config file exists
CONFIG_FILE="${CONFIG_DIR}/${CONFIG_FILENAME}"
if [ -z "${CONFIG_FILE}" -o ! -e "${CONFIG_FILE}" ]; then
    echo "ERROR: Configuration file ${CONFIG_FILE} NOT FOUND!!"
    exit 4
fi

# execution-related variables
FORCE_SHUTDOWN=${FORCE_SHUTDOWN:-false}
PIDFILE=${PIDFILE:-"${LOG_DIR}/nest-swagger-node.pid"}

# Looks for a nest-swagger-node process.  If we find one, take note of the ID.  If not, remove any
# record of past nest-swagger-node process IDs.
PSCMD="ps -ef | grep -i 'PM2 v.* God Daemon' | grep -v grep | awk '{ print \$2 };' ORS=' '"
PID=$(eval ${PSCMD})
if [ -z "$PID" ]; then
    rm -f "$PIDFILE"
else
    echo "$PID" > "$PIDFILE"
fi

# function for starting the Marin Publisher Object Processor process
start() {
    if [ ! -z "$PID" ]; then
        echo "$NAME is already running pid=$PID"
        return
    fi

    # pushd into the base directory, so we start from there
    pushd "${SERVICE_HOME}" > /dev/null 2>&1

    # Start your engines
    sudo -u ${USER_NAME} npm start >> "${MARINPUBLISHERGATETWAYPLUGINSSERVICESTART_LOGFILE}" 2>&1

    # popd back to where we started
    popd > /dev/null 2>&1

    echo $! > "$PIDFILE"
    sleep 2
    PID=$(eval ${PSCMD})
    if [ ! -z "$PID" ]; then
        echo ${PID} > "${PIDFILE}"
        echo "Started $NAME $MARIN_ENV pid=$PID"
    else
        echo "Failed to start the $NAME, please see logs in $LOG_DIR"
    fi
}

# function for stopping the nest-swagger-node process
stop() {
    if [ -z "$PID" ]; then
        echo "$NAME was not running."
        return
    fi

    # pushd into the base directory, so we start from there
    pushd "${SERVICE_HOME}" > /dev/null 2>&1

    # run pm2-update will allow any older in memory pm2 to be updated to the current one
    # which enables operations such as killing it
    sudo -u ${USER_NAME} npm run pm2-update >> "${MARINPUBLISHERGATETWAYPLUGINSSERVICESTART_LOGFILE}" 2>&1
    sudo -u ${USER_NAME} npm run kill-god-daemon >> "${MARINPUBLISHERGATETWAYPLUGINSSERVICESTART_LOGFILE}" 2>&1

    tries=""
    echo "Stopping $NAME pid=$PID "
    while (true); do
        PID=$(eval ${PSCMD})
        if [ ! -z "$PID" ]; then
            if [ "x$tries" == "x.........." ]; then
                PID=$(eval ${PSCMD})
                if [ "$FORCE_SHUTDOWN" == "true" ] ; then
                    echo ""
                    echo "$NAME did not go gentle into that good night, murdering. pid=$PID"
                    kill -9 "$PID"
                    #Push back the dots so we can wait for kill to finish
                    tries=""
                else
                    echo ""
                    echo "$NAME did not go gentle into that good night. pid=$PID"
                    break
                fi
            fi
            sleep 3
            tries=".$tries"
            echo -n "."
        else
            echo ""
            echo "Shutdown complete. Removing PID file $PIDFILE."
            break
        fi
    done

    # popd back to where we started
    popd > /dev/null 2>&1
    rm -f "$PIDFILE"
    unset PID
}

status() {
    if [ -z "$PID" ]; then
        echo "$NAME is not running."
    else
        echo "$NAME is running, pid=$PID"
    fi
}

restart() {
    stop
    start
}

force_shutdown() {
    FORCE_SHUTDOWN=true
    stop
}

# run the function corresponding to the argument supplied by the script caller
case $1 in
        start)
            start
        ;;
        stop)
            stop
        ;;
        restart)
            restart
        ;;
        force_shutdown)
            force_shutdown
        ;;
        status)
            status
        ;;
        *)
            echo $"Usage: $0 {start|stop|restart|force_shutdown|status}"
            RETVAL=1
        ;;
esac

exit 0
